import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import api from "../api/axiosConfig.js"
import { useNavigate } from "react-router-dom";
import { UserRole } from "../constants/auth.constant.js";

const { Title, Text: AntText } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("http://localhost:8000/api/v1/auth/login", {
        username: values.username,
        password: values.password,
      });
      const { access_token, user } = response.data;
      const userRole = user.role;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", userRole);
      message.success("Login successfully!");

      if (userRole === UserRole.ADMIN) {
        navigate("/admin/dashboard");
      } else if (userRole === UserRole.STUDENT) {
        navigate("/student/profile")
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid username or password!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#fdf0f5"
      }}
    >
      <div
        style={{
          width: 400,
          background: "#fff",
          borderRadius: 16,
          padding: "48px 40px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8, color: "#1a1a1a" }}>
            Welcome back
          </Title>
          <AntText type="secondary">Sign in to continue to your portal</AntText>
        </div>

        <div
          style={{
            display: "flex",
            background: "#f0f0f0",
            borderRadius: 10,
            padding: 4,
            marginBottom: 32,
          }}
        >
          {["Admin", "Student"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.3s",
                background: role === r ? "#fff" : "transparent",
                color: role === r ? "#e91e8c" : "#595959",
                fontWeight: role === r ? 700 : 500,
                boxShadow: role === r ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <Form
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<AntText strong>Username</AntText>}
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              placeholder="Enter your username"
              size="large"
              style={{ borderRadius: 8, padding: "10px 12px" }}
            />
          </Form.Item>

          <Form.Item
            label={<AntText strong>Password</AntText>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="••••••••"
              size="large"
              style={{ borderRadius: 8, padding: "10px 12px" }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 40 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                background: "#e91e8c",
                borderColor: "#e91e8c",
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Sign in as {role}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <AntText style={{ fontSize: 13, color: "#bfbfbf" }}>
            Need help? Contact <a href="mailto:it@school.edu" style={{ color: "#e91e8c" }}>IT Department</a>
          </AntText>
        </div>
      </div>
    </div>
  );
};

export default Login;
