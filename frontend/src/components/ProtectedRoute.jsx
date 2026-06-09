import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'TUTOR') {
            return <Navigate to="/tutor-dashboard" replace />;
        }

        if (role === 'STUDENT') {
            return <Navigate to="/student-dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;