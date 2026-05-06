import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Eye } from 'lucide-react';
import { registerUser } from '../services/authService';

function RegisterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialRole = searchParams.get('role') || 'STUDENT';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(initialRole);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!agreeTerms) {
            setErrorMessage('You must agree to the Terms of Service and Privacy Policy.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);

            const data = await registerUser({
                fullName,
                email,
                password,
                role,
            });

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            setSuccessMessage('Account created successfully!');
            navigate('/profile');
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

                <p className="auth-subtitle">Create your account</p>

                <form className="auth-card" onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <div className="input-with-icon">
                        <User size={18} className="input-icon" />
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                        />
                    </div>

                    <label>Email Address</label>
                    <div className="input-with-icon">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <label>I am a...</label>
                    <div className="role-selector">
                        <button
                            type="button"
                            className={role === 'STUDENT' ? 'role-option active' : 'role-option'}
                            onClick={() => setRole('STUDENT')}
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            className={role === 'TUTOR' ? 'role-option active' : 'role-option'}
                            onClick={() => setRole('TUTOR')}
                        >
                            Tutor
                        </button>
                    </div>

                    <label>Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <Eye size={18} className="input-icon-right" />
                    </div>

                    <label>Confirm Password</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        <Eye size={18} className="input-icon-right" />
                    </div>

                    <label className="checkbox-label terms-label">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(event) => setAgreeTerms(event.target.checked)}
                        />
                        <span>
                            I agree to the <span className="auth-link">Terms of Service</span> and{' '}
                            <span className="auth-link">Privacy Policy</span>
                        </span>
                    </label>

                    {errorMessage && <p className="form-error">{errorMessage}</p>}
                    {successMessage && <p className="form-success">{successMessage}</p>}

                    <button className="primary-button" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="bottom-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;