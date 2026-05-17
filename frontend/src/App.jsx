import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import Login from './pages/Login';
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import StudentTable from "./pages/admin/Student.jsx";
import AdminClass from "./pages/admin/Class.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import RoleDashboard from "./components/RoleDashboard.jsx";
import { UserRole } from "./constants/auth.constant.js";
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Auth Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole={UserRole.ADMIN}>
              <AdminDashboard role={UserRole.ADMIN}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student"
          element={
            <ProtectedRoute allowedRole={UserRole.ADMIN}>
              <StudentTable role={UserRole.ADMIN}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/class"
          element={
            <ProtectedRoute allowedRole={UserRole.ADMIN}>
              <AdminClass role={UserRole.ADMIN}/>
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
