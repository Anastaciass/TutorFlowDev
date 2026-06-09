import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye } from 'lucide-react';
import { loginUser } from '../services/authService';

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            setIsLoading(true);

            const data = await loginUser({
                email,
                password,
            });


            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('role', data.role);

            if (data.role === 'TUTOR') {
                navigate('/tutor-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <div className="auth-wrapper">
                <h1 className="brand brand-with-icon">
                    <GraduationCap size={34} className="brand-icon" />
                    <span>TutorFlow</span>
                </h1>

                <p className="auth-subtitle">Sign in to your account</p>

                <form className="auth-card" onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <div className="input-with-icon">
                        <Mail size={18} className="input-icon" />
                        <input
                            data-testid="email-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <label>Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input
                            data-testid="password-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <Eye size={18} className="input-icon-right" />
                    </div>

                    {errorMessage && <p className="form-error">{errorMessage}</p>}

                    <button
                        data-testid="login-button"
                        className="primary-button"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="bottom-text">
                        Don’t have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;