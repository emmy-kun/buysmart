import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
}