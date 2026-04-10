import { Link, useSearchParams } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Eye } from 'lucide-react';

function RegisterPage() {
    const [searchParams] = useSearchParams();
    const roleFromQuery = searchParams.get('role') || 'STUDENT';

    return (
        <div className="page auth-page">
            <div className="auth-wrapper">
                <h1 className="brand brand-with-icon">
                    <GraduationCap size={34} className="brand-icon" />
                    <span>TutorFlow</span>
                </h1>

                <p className="auth-subtitle">Create your account</p>

                <div className="auth-card">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                        <User size={18} className="input-icon" />
                        <input type="text" placeholder="John Doe" />
                    </div>

                    <label>Email Address</label>
                    <div className="input-with-icon">
                        <Mail size={18} className="input-icon" />
                        <input type="email" placeholder="you@example.com" />
                    </div>

                    <label>I am a...</label>
                    <div className="role-selector">
                        <button
                            type="button"
                            className={roleFromQuery === 'STUDENT' ? 'role-option active' : 'role-option'}
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            className={roleFromQuery === 'TUTOR' ? 'role-option active' : 'role-option'}
                        >
                            Tutor
                        </button>
                    </div>

                    <label>Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input type="password" placeholder="••••••••" />
                        <Eye size={18} className="input-icon-right" />
                    </div>

                    <label>Confirm Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input type="password" placeholder="••••••••" />
                        <Eye size={18} className="input-icon-right" />
                    </div>

                    <label className="checkbox-label terms-label">
                        <input type="checkbox" />
                        <span>
              I agree to the <span className="auth-link">Terms of Service</span> and{' '}
                            <span className="auth-link">Privacy Policy</span>
            </span>
                    </label>

                    <button className="primary-button">Create Account</button>

                    <p className="bottom-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;