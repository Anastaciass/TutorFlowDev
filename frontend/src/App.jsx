import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TutorDashboardPage from './pages/TutorDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tutor-dashboard" element={<TutorDashboardPage />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
      </Routes>
  );
}

export default App;