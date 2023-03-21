import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
      </Routes>
    </Router>
  );
};

export default App;
