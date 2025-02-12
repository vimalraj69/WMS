import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import DashBoard  from "./Components/DashBoard";
function App() {

 
  return (
    
    <div>
      {/* <DashBoard/> */}
      <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/DashBoard" element={<DashBoard />} />
      </Routes>
    </Router>
      
    </div>

  );
}

export default App;
