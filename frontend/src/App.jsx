import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { Button } from 'antd';
const Dashboard = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>🎉 Dashboard</h1>
    <p>Call API Login successfully</p>
    <Button type="primary" danger onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
      Log out
    </Button>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
