// frontend/src/components/AdminRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


// Denne komponent beskytter routes, så kun ADMIN-brugere kan tilgå dem.
// Den bruges i App.tsx som fx:
// <Route element={<AdminRoute />}> ... admin sider ... </Route>
const AdminRoute: React.FC = () => {
    // Henter auth-state fra vores useAuth-hook
    // isAuthenticated → om brugeren er logget ind
    // loading → om auth-data stadig hentes
    // isAdmin → om brugerens role === "admin"
    const { isAuthenticated, loading, isAdmin } = useAuth();

    // Hvis auth stadig loader → vis en simpel loader
    if (loading) {
        return React.createElement("div", null, "Loader brugerdata...");
    }

    // Hvis brugeren ikke er logget ind → redirect til login
    if (!isAuthenticated) {
        return React.createElement(Navigate, {
            to: "/login",
            replace: true,
        });
    }

    // Hvis brugeren er logget ind, men ikke admin → redirect til forsiden
    if (!isAdmin) {
        return React.createElement(Navigate, {
            to: "/",
            replace: true,
        });
    }

    // Hvis brugeren er logget ind OG er admin → vis child routes
    // Outlet betyder: render de sider der ligger inde i denne route
    return React.createElement(Outlet);
};

export default AdminRoute;
