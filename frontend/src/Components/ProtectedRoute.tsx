
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  user: any;
  children: any;
};

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;