function ProfilePage() {
    return (
        <div className="page profile-page">
            <header className="topbar">
                <div className="logo">TutorBook</div>
                <div className="nav-actions">
                    <button className="top-link button-link">Sign In</button>
                    <button className="small-primary-button">Sign Up</button>
                </div>
            </header>

            <main className="profile-content">
                <section className="profile-header">
                    <h1>Profile</h1>
                    <p>Manage your account information</p>
                </section>

                <section className="profile-card">
                    <div className="avatar-circle">👤</div>

                    <div className="profile-main-info">
                        <h2>Dr. Sarah Johnson</h2>
                        <p className="role-text">Tutor</p>

                        <div className="profile-details">
                            <p>sarah.johnson@email.com</p>
                            <p>+1 (555) 123-4567</p>
                            <p>San Francisco, CA</p>
                            <p>8 years experience</p>
                        </div>
                    </div>

                    <button className="small-primary-button">Edit Profile</button>
                </section>
            </main>
        </div>
    );
}

export default ProfilePage;
