// frontend/src/routes.tsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import MovieDetailPage from './components/MovieDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(App),
  },
  {
    path: "/movies/:id",
    element: React.createElement(MovieDetailPage), // ⬅️ INGEN hardcoded movie
  },
    {
    path: "/login",
    element: React.createElement(LoginPage)
  },
  {
    path: "/signup",
    element: React.createElement(SignupPage)
  },
  {
    path: "/profile",
    element: React.createElement(ProtectedRoute),
    children: [
      {
        path: "",
        element: React.createElement(ProfilePage)
      }
    ]
  }
]);

const AppRoutes = () => {
  return React.createElement(RouterProvider, { router });
};

export default AppRoutes;


