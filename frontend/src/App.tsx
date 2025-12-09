// frontend/src/App.tsx
import React from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import "./style/app.css";

// ---------------------------------------------------------------------------
// App-komponenten fungerer som "root" i frontend'en.
// Den wrapper hele appen i Layout (navbar + main container)
// og viser HomePage som default indhold.
// ---------------------------------------------------------------------------

function App() {
  return React.createElement(
    Layout,
    null,
    React.createElement(HomePage)
  );
}

export default App;
