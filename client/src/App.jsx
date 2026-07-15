import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./features/authentication/pages/Login";
import ForgotPassword from "./features/authentication/pages/ForgotPassword";
import ResetPassword from "./features/authentication/pages/ResetPassword";
import PasswordResetSuccess from "./features/authentication/pages/PasswordResetSuccess";

/**
 * Main application component responsible for routing.
 * Sets up the base navigation structure for the authentication module.
 *
 * @returns {JSX.Element} The rendered application router.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root path to the login page by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication flow routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<PasswordResetSuccess />} />
        {/* Mock dashboard route to verify successful login redirect */}
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
              <h1 className="text-3xl font-bold text-textPrimary mb-4">
                Welcome to ContractIQ
              </h1>
              <p className="text-textSecondary">
                You have successfully logged in.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="mt-8 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
