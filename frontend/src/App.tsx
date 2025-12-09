// frontend/src/App.tsx
import React from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import "./style/kamilla.css";
import "./style/naomi.css";

// App er en sheel rundt omkring homepage
function App() {
  return React.createElement(
    Layout,
    null,
    React.createElement(HomePage)
  );
}

export default App;
