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
import { createLessonSlot } from '../services/lessonSlotService';
import { getCurrentUser } from '../services/authService';

function TutorDashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleCreateSlot = async (event) => {
        event.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        try {
            const accessToken = localStorage.getItem('accessToken');

            await createLessonSlot(accessToken, {
                subject,
                date,
                startTime,
                endTime,
            });

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
            } catch (error) {
                console.error(error);
            }
        };

        loadUser();
    }, []);

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
                    <button className="active-tab">Booking Requests <span>1</span></button>
                    <button>Upcoming Lessons</button>
                    <button>Past Lessons</button>
                </section>

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
                            <button>
                                <GraduationCap size={34} />
                                Tutor Dashboard
                            </button>

                            <button>
                                <CircleUserRound size={34} />
                                Profile
                            </button>

                            <button>
                                <Calendar size={34} />
                                Calendar
                            </button>
                        </nav>

                        <button className="side-menu-logout">
                            Log Out
                        </button>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default TutorDashboardPage;