// frontend/src/components/AdminRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute: React.FC = () => {
    const { isAuthenticated, loading, isAdmin } = useAuth();

    if (loading) {
        return React.createElement("div", null, "Loader brugerdata...");
    }

    if (!isAuthenticated) {
        // Ikke logget ind → send til login
        return React.createElement(Navigate, {
            to: "/login",
            replace: true,
        });
    }

    if (!isAdmin) {
        // Logget ind, men ikke admin → send til forsiden
        return React.createElement(Navigate, {
            to: "/",
            replace: true,
        });
    }

    // OK → vis child routes
    return React.createElement(Outlet);
};

export default AdminRoute;
