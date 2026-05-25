import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';

const PrivateRoute = ({
    children,
    allowedRoles,
    noLayout = false,
    requiredPermission,
    requiredAnyPermissions,
}) => {
    const { user, loading, hasPermission, hasAnyPermission } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRole = user.role;

    if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase())) {
        return <Navigate to="/dashboard" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (requiredAnyPermissions && Array.isArray(requiredAnyPermissions) && requiredAnyPermissions.length > 0) {
        if (!hasAnyPermission(requiredAnyPermissions)) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    if (noLayout) {
        return <>{children}</>;
    }

    return <MainLayout>{children}</MainLayout>;
};

export default PrivateRoute;
