import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, CircleUserRound, Mail, Shield, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../services/authService';

function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserProfile = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                navigate('/login');
                return;
            }

            try {
                const userData = await getCurrentUser(accessToken);
                setUser(userData);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserProfile();
    }, [navigate]);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            if (refreshToken) {
                await logoutUser(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error.message);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="page profile-page">
                <div className="profile-loading">Loading profile...</div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="page profile-page">
                <div className="profile-error-box">
                    <p>{errorMessage}</p>
                    <Link to="/login" className="auth-link">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page profile-page">
            <header className="topbar">
                <div className="logo logo-with-icon">
                    <GraduationCap size={30} className="brand-icon" />
                    <span>TutorFlow</span>
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </header>

            <main className="profile-content">
                <section className="profile-header">
                    <h1>Profile</h1>
                    <p>Manage your account information</p>
                </section>

                <section className="profile-card">
                    <div className="avatar-circle">
                        <CircleUserRound size={54} />
                    </div>

                    <div className="profile-main-info">
                        <h2>{user?.fullName}</h2>
                        <p className="role-text">{user?.role}</p>

                        <div className="profile-details profile-details-single">
                            <div className="profile-detail-item">
                                <Mail size={18} />
                                <span>{user?.email}</span>
                            </div>

                            <div className="profile-detail-item">
                                <Shield size={18} />
                                <span>User ID: {user?.id}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ProfilePage;