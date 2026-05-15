import { useEffect, useState } from 'react';
import {
    GraduationCap,
    Plus,
    X,
    User,
    Calendar,
    Clock,
    CheckCircle,
    Menu,
    CircleUserRound
} from 'lucide-react';
import { createLessonSlot, getTutorSlots } from '../services/LessonSlotService';
import { getCurrentUser, logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function TutorDashboardPage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [slots, setSlots] = useState([]);
    const [activeTab, setActiveTab] = useState('booking');


    const handleCreateSlot = async (event) => {
        event.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        try {
            const accessToken = localStorage.getItem('accessToken');

            const createdSlot = await createLessonSlot(accessToken, {
                subject,
                date,
                startTime,
                endTime,
            });

            setSlots((previousSlots) => [...previousSlots, createdSlot]);

            setSuccessMessage('Time slot created successfully.');
            setSubject('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setIsModalOpen(false);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                const userData = await getCurrentUser(token);
                setUser(userData);

                const tutorSlots = await getTutorSlots(token);
                setSlots(tutorSlots);

            } catch (error) {
                console.error(error);
            }
        };

        loadUser();
    }, []);
    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            if (refreshToken) {
                await logoutUser(refreshToken);
            }
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            navigate('/login');
        }
    };
    const formatTime = (time) => {
        if (!time) {
            return '';
        }

        return time.slice(0, 5);
    };
    const formatDate = (date) => {
        if (!date) {
            return '';
        }

        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };
    const isUpcomingSlot = (slot) => {
        const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
        const now = new Date();

        return slotDateTime >= now;
    };
    return (
        <div className="dashboard-page">
            <header className="dashboard-topbar">
                <div className="logo logo-with-icon">
                    <GraduationCap size={30} className="brand-icon" />
                    <span>TutorFlow</span>
                </div>

                <button className="hamburger-button" onClick={() => setIsMenuOpen(true)}>
                    <Menu size={28} />
                </button>
            </header>

            <main className="dashboard-content">
                <section className="dashboard-header-row">
                    <div>
                        <h1>Tutor Dashboard</h1>
                        <p>Welcome back, {user?.fullName}</p>
                    </div>

                    <button className="primary-action-button" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} />
                        Create Time Slot
                    </button>
                </section>

                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <section className="stats-grid">
                    <div className="stat-card">
                        <p>Pending Requests</p>
                        <strong className="stat-orange">1</strong>
                    </div>

                    <div className="stat-card">
                        <p>Upcoming Lessons</p>
                        <strong className="stat-blue">2</strong>
                    </div>

                    <div className="stat-card">
                        <p>Completed Lessons</p>
                        <strong className="stat-green">1</strong>
                    </div>
                </section>

                <section className="dashboard-tabs">
                    <button
                        className={activeTab === 'booking' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('booking')}
                    >
                        Booking Requests <span>1</span>
                    </button>

                    <button
                        className={activeTab === 'upcoming' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Lessons
                    </button>

                    <button
                        className={activeTab === 'past' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Lessons
                    </button>
                </section>

                {activeTab === 'booking' && (
                    <section className="booking-card">
                        <h3>Mathematics</h3>
                        <span className="pending-pill">Pending Approval</span>

                        <div className="booking-info">
                            <p><User size={18} /> Student: Alex Chen</p>
                            <p><Calendar size={18} /> Sunday, February 15, 2026</p>
                            <p><Clock size={18} /> 14:00 - 15:00</p>
                        </div>

                        <div className="booking-actions">
                            <button className="confirm-button">
                                <CheckCircle size={18} />
                                Confirm
                            </button>
                            <button className="decline-button">
                                <X size={18} />
                                Decline
                            </button>
                        </div>
                    </section>
                )}

                {activeTab === 'upcoming' && (
                    <section className="slot-list">
                        {slots.length === 0 ? (
                            <p className="empty-state">No upcoming lesson slots yet.</p>
                        ) : (
                            [...slots]
                                .filter(isUpcomingSlot)
                                .sort((a, b) => {
                                    const dateTimeA = new Date(`${a.date}T${a.startTime}`);
                                    const dateTimeB = new Date(`${b.date}T${b.startTime}`);

                                    return dateTimeA - dateTimeB;
                                })
                                .map((slot) => (
                                <div className="booking-card" key={slot.id}>
                                    <h3>{slot.subject}</h3>

                                    <span className={slot.status === 'AVAILABLE' ? 'available-pill' : 'pending-pill'}>
                        {slot.status === 'AVAILABLE' ? 'Available' : slot.status}
                    </span>

                                    <div className="booking-info">
                                        <p><Calendar size={18} /> {formatDate(slot.date)}</p>
                                        <p><Clock size={18} /> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                )}

                {activeTab === 'past' && (
                    <section className="slot-list">
                        <p className="empty-state">No past lessons yet.</p>
                    </section>
                )}
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <form className="slot-modal" onSubmit={handleCreateSlot}>
                        <div className="modal-header">
                            <h2>Create Time Slot</h2>
                            <button type="button" className="modal-close-button" onClick={() => setIsModalOpen(false)}>
                                <X size={34} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <label>
                                Subject
                                <input
                                    type="text"
                                    placeholder="e.g., Mathematics, Physics"
                                    value={subject}
                                    onChange={(event) => setSubject(event.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                Date
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    required
                                />
                            </label>

                            <div className="time-row">
                                <label>
                                    Start Time
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(event) => setStartTime(event.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    End Time
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(event) => setEndTime(event.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="create-slot-button">
                                    Create Slot
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {isMenuOpen && (
                <div className="side-menu-overlay">
                    <aside className="side-menu">
                        <div className="side-menu-header">
                            <div className="logo logo-with-icon">
                                <GraduationCap size={40} className="brand-icon" />
                                <span>TutorFlow</span>
                            </div>

                            <button className="side-menu-close" onClick={() => setIsMenuOpen(false)}>
                                <X size={36} />
                            </button>
                        </div>

                        <nav className="side-menu-links">
                            <button onClick={() => setIsMenuOpen(false)}>
                                <GraduationCap size={34} />
                                Tutor Dashboard
                            </button>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate('/profile');
                                }}
                            >
                                <CircleUserRound size={34} />
                                Profile
                            </button>

                            <button>
                                <Calendar size={34} />
                                Calendar
                            </button>
                        </nav>

                        <button className="side-menu-logout" onClick={handleLogout}>
                            Log Out
                        </button>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default TutorDashboardPage;