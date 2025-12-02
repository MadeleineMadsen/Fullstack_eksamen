// frontend/src/App.tsx
import React from "react";
import HomePage from "./pages/HomePage";
import "./style/kamilla.css";

function App() {
  // App er nu bare en “shell” rundt om HomePage
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(HomePage)
  );
}

export default App;
