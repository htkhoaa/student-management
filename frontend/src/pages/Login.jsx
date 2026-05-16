import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import api from "../api/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../constants/auth.constant.js";

const { Title, Text: AntText } = Typography;

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/api/v1/auth/login", {
        username: values.username,
        password: values.password,
      });
      const { access_token, user } = response.data;
      const userRole = user.role;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", userRole);
      messageApi.success("Login successfully!");

      if (userRole === UserRole.ADMIN) {
        navigate("/admin/dashboard");
      } else if (userRole === UserRole.STUDENT) {
        if (user.student_id) {
          localStorage.setItem("studentId", user.student_id);
          navigate("/student/profile");
        } else {
          messageApi.error("Data error: Your account is not linked to a student profile.");
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid username or password!";
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fdf0f5",
      }}
    >
        {contextHolder}
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
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <AntText style={{ fontSize: 13, color: "#bfbfbf" }}>
            Need help? Contact{" "}
            <a href="mailto:it@school.edu" style={{ color: "#e91e8c" }}>
              IT Department
            </a>
          </AntText>
        </div>
      </div>
    </div>
  );
};

export default Login;