import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye } from 'lucide-react';

function LoginPage() {
    return (
        <div className="page auth-page">
            <div className="auth-wrapper">
                <h1 className="brand brand-with-icon">
                    <GraduationCap size={34} className="brand-icon" />
                    <span>TutorFlow</span>
                </h1>

                <p className="auth-subtitle">Sign in to your account</p>

                <div className="auth-card">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                        <Mail size={18} className="input-icon" />
                        <input type="email" placeholder="you@example.com" />
                    </div>

                    <label>Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input type="password" placeholder="••••••••" />
                        <Eye size={18} className="input-icon-right" />
                    </div>

                    <div className="auth-row">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <span className="auth-link">Forgot password?</span>
                    </div>

                    <button className="primary-button">Sign In</button>

                    <p className="bottom-text">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;