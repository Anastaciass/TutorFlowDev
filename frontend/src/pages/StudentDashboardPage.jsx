import { useEffect, useState } from 'react';
import { GraduationCap, Calendar, Clock, BookOpen, Menu, X, CircleUserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/authService';
import { getAvailableSlots } from '../services/LessonSlotService';

function StudentDashboardPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [slots, setSlots] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                const userData = await getCurrentUser(token);
                setUser(userData);

                const availableSlots = await getAvailableSlots(token);
                setSlots(availableSlots);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        loadDashboardData();
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
                        <h1>Student Dashboard</h1>
                        <p>Welcome back, {user?.fullName}</p>
                    </div>
                </section>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <section className="stats-grid">
                    <div className="stat-card">
                        <p>Available Slots</p>
                        <strong className="stat-blue">{slots.filter(isUpcomingSlot).length}</strong>
                    </div>

                    <div className="stat-card">
                        <p>Upcoming Lessons</p>
                        <strong className="stat-green">0</strong>
                    </div>

                    <div className="stat-card">
                        <p>Completed Lessons</p>
                        <strong className="stat-orange">0</strong>
                    </div>
                </section>

                <section className="dashboard-tabs">
                    <button className="active-tab">
                        Available Slots <span>{slots.filter(isUpcomingSlot).length}</span>
                    </button>
                    <button>My Bookings</button>
                    <button>Past Lessons</button>
                </section>

                <section className="slot-list">
                    {slots.filter(isUpcomingSlot).length === 0 ? (
                        <p className="empty-state">No available lesson slots yet.</p>
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

                                    <span className="available-pill">Available</span>

                                    <div className="booking-info">
                                        <p>
                                            <CircleUserRound size={18} />
                                            Tutor: {slot.tutorName}
                                        </p>
                                        <p>
                                            <Calendar size={18} />
                                            {formatDate(slot.date)}
                                        </p>
                                        <p>
                                            <Clock size={18} />
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </p>
                                    </div>

                                    <button className="book-slot-button">
                                        <BookOpen size={18} />
                                        Book This Slot
                                    </button>
                                </div>
                            ))
                    )}
                </section>
            </main>

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
                                Student Dashboard
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

export default StudentDashboardPage;