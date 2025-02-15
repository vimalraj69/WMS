import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import DashBoard from "./Components/DashBoard";
import Stocks from "./Components/Stocks";
import Layout from "./Components/Layout";  // Import the new Layout component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Protected Routes (With Navigation Bar) */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="stocks" element={<Stocks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
