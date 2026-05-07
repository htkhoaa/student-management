import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Administrator");

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:8000/login", {
        ...values,
        role,
      });
      localStorage.setItem("token", response.data.access_token);
      message.success("Login successfully!");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Connecting failed to server!";
      message.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#fdf0f5",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          borderRadius: 12,
          padding: "40px 36px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Title level={3} style={{ marginBottom: 4 }}>
          Welcome back
        </Title>
        <p style={{ color: "#8c8c8c", marginBottom: 24 }}>
          Sign in to continue to your portal
        </p>

        {/* Tab Role */}
        <div
          style={{
            display: "flex",
            background: "#f5f5f5",
            borderRadius: 8,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {["Administrator", "Student"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                background: role === r ? "#fff" : "transparent",
                fontWeight: role === r ? 600 : 400,
                boxShadow: role === r ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <Form name="login_form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required!" }]}
          >
            <Input
              placeholder="admin"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required!" }]}
          >
            <Input.Password
              placeholder="••••••"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{
                background: "#e91e8c",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Sign in as {role}
            </Button>
          </Form.Item>
        </Form>

        {/* Demo accounts */}
        <div
          style={{
            background: "#f0f7ff",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          <strong>Demo accounts</strong>
          <br />
          <span>
            <strong>admin</strong> / admin · <strong>student</strong> / student
          </span>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: 13, color: "#8c8c8c" }}>
          Need help? Contact <a href="mailto:it@school.edu">it@school.edu</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
