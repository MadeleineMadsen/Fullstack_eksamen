// frontend/src/routes.tsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import MovieDetailPage from "./pages/MovieDetailPage"; // ⬅️ VIGTIGT: fra pages

const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(App),
  },
  {
    path: "/movies/:id",
    element: React.createElement(MovieDetailPage), // ⬅️ INGEN hardcoded movie
  },
]);

const AppRoutes = () => {
  return React.createElement(RouterProvider, { router });
};

export default AppRoutes;
