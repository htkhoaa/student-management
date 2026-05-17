import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate  } from 'react-router-dom';
import Login from './pages/Login';
import { Button, Typography, Space } from 'antd';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
const { Title } = Typography;
import Profile from "./pages/Profile.jsx";
import RoleDashboard from "./components/RoleDashboard.jsx";
import { UserRole } from "./constants/auth.constant.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

          <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole={UserRole.ADMIN}>
              <RoleDashboard role={UserRole.ADMIN}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole={UserRole.STUDENT}>
              <RoleDashboard role={UserRole.STUDENT}/>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
