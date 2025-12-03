import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import MovieDetailPage from './components/MovieDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';

// Test data
const testMovies = [
  {
    id: 1,
    title: "Inception",
    overview: "Dom Cobb er en erfaren tyv...",
    rating: 8.8,
    released: "2010-07-16",
    runtime: 148,
    director: "Christopher Nolan",
    poster_image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    background_image: "https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg"
  },
  {
    id: 2, 
    title: "The Dark Knight",
    overview: "Med hjælp fra lieutenant Jim Gordon...",
    rating: 9.0,
    released: "2008-07-18",
    runtime: 152,
    director: "Christopher Nolan",
    poster_image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    background_image: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  }
];

const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(App)
  },
  {
    path: "/movies/:id",
    element: React.createElement(MovieDetailPage, { movie: testMovies[0] })
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