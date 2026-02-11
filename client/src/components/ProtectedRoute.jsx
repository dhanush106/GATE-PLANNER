import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/useStore';

// WHY: Protects routes that require authentication
// Redirects to login if not authenticated
const ProtectedRoute = () => {
    const isAuthenticated = useStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
