// frontend/src/routes.tsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import AdminRoute from "./components/AdminRoute";
import CreateMoviePage from "./pages/CreateMoviePage";
import AdminMoviesPage from "./pages/AdminMoviesPage";


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
    path: "/profile",
    element: React.createElement(ProtectedRoute),
    children: [
      {
        path: "",
        element: React.createElement(ProfilePage),
      },
    ],
  },
  // 🔐 ADMIN-DEL
  {
    path: "/admin",
    element: React.createElement(AdminRoute),
    children: [
        {
        path: "movies",              // /admin/movies  -> liste med film
        element: React.createElement(AdminMoviesPage),
      },
      {
        path: "movies/new", // fuld path = /admin/movies/new
        element: React.createElement(CreateMoviePage),
      },
    ],
  },

  // (VALGFRI) 404-route, hvis du har en ErrorPage
  // {
  //   path: "*",
  //   element: React.createElement(ErrorPage),
  // },
]);

const AppRoutes = () => {
  return React.createElement(RouterProvider, { router });
};

export default AppRoutes;

