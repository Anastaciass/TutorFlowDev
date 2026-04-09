function LoginPage() {
    return (
        <div className="page auth-page">
            <div className="auth-wrapper">
                <h1 className="brand">TutorBook</h1>
                <p className="auth-subtitle">Sign in to your account</p>

                <div className="auth-card">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@example.com" />

                    <label>Password</label>
                    <input type="password" placeholder="••••••••" />

                    <div className="auth-row">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <span className="auth-link">Forgot password?</span>
                    </div>

                    <button className="primary-button">Sign In</button>

                    <p className="bottom-text">
                        Don&apos;t have an account? <span className="auth-link">Sign up</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
