import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all the pages from your 'src/pages' folder
// Use curly braces for components that have 'export const'
// Use no curly braces for components that have 'export default'

import Login from "./pages/Login";
import Register from "./pages/Register";
import { Onboarding } from "./pages/Onboarding"; // Assuming export const Onboarding
import { LogExpense } from "./pages/LogExpense"; // Assuming export const LogExpense
import { Budget } from "./pages/Budget"; // Assuming export const Budget
import NotFound from "./pages/NotFound"; // Assuming export default NotFound
import Index from "./pages/Index"; // Assuming export default Index
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/logexpense" element={<LogExpense />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/dashboard" element={<Index />} />
        </Route>

        {/* Catch-all route for 404 Not Found pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
