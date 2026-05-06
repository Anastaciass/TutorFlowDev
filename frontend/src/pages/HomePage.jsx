import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, UserRound, CalendarDays } from 'lucide-react';

function HomePage() {
    const navigate = useNavigate();

    const handleRegister = (role) => {
        navigate(`/register?role=${role}`);
    };

    return (
        <div className="page home-page">
            <header className="topbar">
                <div className="logo logo-with-icon">
                    <GraduationCap size={28} className="brand-icon" />
                    <span>TutorFlow</span>
                </div>

                <Link to="/login" className="top-link">
                    Log in
                </Link>
            </header>

            <main className="home-content">
                <section className="hero">
                    <h1>Welcome to TutorFlow</h1>
                    <p>
                        Connect tutors and students seamlessly. Manage time slots,
                        book lessons, and track your learning journey.
                    </p>
                </section>

                <section className="role-cards">
                    <div className="role-card">
                        <div className="role-title-row">
                            <div className="role-icon role-icon-tutor">
                                <UserRound size={24} />
                            </div>
                            <h2>I&apos;m a Tutor</h2>
                        </div>

                        <p>
                            Create and manage your available time slots, review booking
                            requests, and track your upcoming lessons.
                        </p>

                        <button
                            onClick={() => handleRegister('TUTOR')}
                            className="text-button tutor-link"
                        >
                            Register as a Tutor →
                        </button>
                    </div>

                    <div className="role-card">
                        <div className="role-title-row">
                            <div className="role-icon role-icon-student">
                                <CalendarDays size={24} />
                            </div>
                            <h2>I&apos;m a Student</h2>
                        </div>
                        <p>
                            Browse available tutors and time slots, book lessons that fit
                            your schedule, and manage your bookings.
                        </p>

                        <button
                            onClick={() => handleRegister('STUDENT')}
                            className="text-button student-link"
                        >
                            Register as a Student →
                        </button>
                    </div>
                </section>

                <section className="how-it-works">
                    <h2>How It Works</h2>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Create Slots</h3>
                            <p>
                                Tutors set up their available time slots with subject details.
                            </p>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Book Lessons</h3>
                            <p>
                                Students browse and book suitable time slots.
                            </p>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Confirm &amp; Learn</h3>
                            <p>
                                Tutors confirm bookings and lessons proceed as scheduled.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomePage;