import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import OutletTry from "./pages/OutletTry";
import OutletSecond from "./pages/OutletSecond";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<UserDashboard />}>
        <Route index element={<OutletTry />} />
        <Route path="test" element={<OutletSecond />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
