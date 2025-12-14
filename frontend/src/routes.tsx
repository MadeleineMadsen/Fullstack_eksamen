import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages & route guards
import App from "./App";
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import AdminRoute from "./components/AdminRoute";
import CreateMoviePage from "./pages/CreateMoviePage";
import AdminMoviesPage from "./pages/AdminMoviesPage";
import NotFoundPage from "./pages/NotFoundPage";

// Router-konfiguration
const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(App),
  },
  {
    path: "/movies/:id",
    element: React.createElement(MovieDetailPage),
  },
  {
    path: "/login",
    element: React.createElement(LoginPage),
  },
  {
    path: "/signup",
    element: React.createElement(SignupPage),
  },
  {
    path: "/profile",   // Beskyttet profil-side
    element: React.createElement(ProtectedRoute),
    children: [
      {
        path: "",
        element: React.createElement(ProfilePage),
      },
    ],
  },

  // Admin routes (kun admin-brugere)
  {
    path: "/admin",
    element: React.createElement(AdminRoute),
    children: [
      {
        path: "movies",
        element: React.createElement(AdminMoviesPage),
      },
      {
        path: "movies/new",
        element: React.createElement(CreateMoviePage),
      },
    ],
  },

  // 404-route
  {
    path: "*",
    element: React.createElement(NotFoundPage),
  },
]);

// Wrapper-komponent
const AppRoutes = () => {
  return React.createElement(RouterProvider, { router });
};

export default AppRoutes;

