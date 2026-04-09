import { useSearchParams } from 'react-router-dom';

function RegisterPage() {
    const [searchParams] = useSearchParams();
    const roleFromQuery = searchParams.get('role') || 'STUDENT';

    return (
        <div className="page auth-page">
            <div className="auth-wrapper">
                <h1 className="brand">TutorBook</h1>
                <p className="auth-subtitle">Create your account</p>

                <div className="auth-card">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" />

                    <label>Email Address</label>
                    <input type="email" placeholder="you@example.com" />

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
                    <input type="password" placeholder="••••••••" />

                    <label>Confirm Password</label>
                    <input type="password" placeholder="••••••••" />

                    <label className="checkbox-label">
                        <input type="checkbox" />
                        I agree to the Terms of Service and Privacy Policy
                    </label>

                    <button className="primary-button">Create Account</button>

                    <p className="bottom-text">
                        Already have an account? <span className="auth-link">Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
