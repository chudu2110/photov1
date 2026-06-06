import React, { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import { postModel } from "../../lib/fetchModelData";

const emptyRegisterForm = {
  // Object này là form đăng ký rỗng, dùng khi reset form sau khi đăng ký xong.
  login_name: "",
  password: "",
  passwordRepeat: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

function LoginRegister({ onLogin }) {
  const navigate = useNavigate();

  // State này lưu dữ liệu người dùng nhập ở form login.
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State này lưu toàn bộ dữ liệu người dùng nhập ở form đăng ký.
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);

  // State này hiển thị thông báo thành công hoặc lỗi cho người dùng.
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State này quyết định có mở form đăng ký hay chỉ hiện form login.
  const [showRegister, setShowRegister] = useState(false);

  function updateRegisterField(field, value) {
    // Hàm này cập nhật đúng một ô trong form đăng ký.
    setRegisterForm({
      ...registerForm,
      [field]: value,
    });
  }

  async function handleLogin(event) {
    // Hàm này xử lý khi người dùng bấm nút Login.
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      // Khối này gửi login_name và password lên backend để tạo session.
      const user = await postModel("/admin/login", {
        login_name: loginName,
        password: loginPassword,
      });

      // Khối này lưu user vào App và chuyển sang trang chi tiết của user đó.
      onLogin(user);
      navigate(`/users/${user._id}`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleRegister(event) {
    // Hàm này xử lý khi người dùng bấm nút Register Me.
    event.preventDefault();
    setError("");
    setMessage("");

    if (registerForm.password !== registerForm.passwordRepeat) {
      // Khối này chặn đăng ký nếu người dùng nhập lại mật khẩu không khớp.
      setError("Passwords do not match.");
      return;
    }

    try {
      // Khối này gửi thông tin đăng ký lên backend để tạo user mới.
      await postModel("/user", {
        login_name: registerForm.login_name,
        password: registerForm.password,
        first_name: registerForm.first_name,
        last_name: registerForm.last_name,
        location: registerForm.location,
        description: registerForm.description,
        occupation: registerForm.occupation,
      });

      // Khối này reset form và quay lại màn login sau khi đăng ký thành công.
      setRegisterForm(emptyRegisterForm);
      setMessage("Registration successful. You can login now.");
      setShowRegister(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <Stack className="login-register" spacing={3}>
      <div>
        <Typography variant="h4">Please Login</Typography>
        <Typography color="text.secondary">
          Login to view users, photos, and comments.
        </Typography>
      </div>

      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}

      <form className="login-register-section" onSubmit={handleLogin}>
        {/* Khối này là form đăng nhập. */}
        <Typography variant="h6">Login</Typography>
        <TextField
          label="Login name"
          onChange={(event) => setLoginName(event.target.value)}
          size="small"
          value={loginName}
        />
        <TextField
          label="Password"
          onChange={(event) => setLoginPassword(event.target.value)}
          size="small"
          type="password"
          value={loginPassword}
        />
        <Button type="submit" variant="contained">Login</Button>
      </form>

      {!showRegister && (
        // Nút này chỉ mở form đăng ký khi người dùng thật sự cần tạo tài khoản.
        <Button
          className="login-register-switch"
          onClick={() => {
            setError("");
            setMessage("");
            setShowRegister(true);
          }}
          variant="text"
        >
          Don't have an account? Create one
        </Button>
      )}

      {showRegister && (
        <form className="login-register-section" onSubmit={handleRegister}>
          {/* Khối này là form đăng ký, chỉ hiện khi showRegister bằng true. */}
          <div className="login-register-heading-row">
            <Typography variant="h6">Register</Typography>
            <Button
              onClick={() => {
                setError("");
                setShowRegister(false);
              }}
              size="small"
              variant="text"
            >
              Back to Login
            </Button>
          </div>
          <TextField label="Login name" onChange={(event) => updateRegisterField("login_name", event.target.value)} size="small" value={registerForm.login_name} />
          <TextField label="Password" onChange={(event) => updateRegisterField("password", event.target.value)} size="small" type="password" value={registerForm.password} />
          <TextField label="Repeat password" onChange={(event) => updateRegisterField("passwordRepeat", event.target.value)} size="small" type="password" value={registerForm.passwordRepeat} />
          <TextField label="First name" onChange={(event) => updateRegisterField("first_name", event.target.value)} size="small" value={registerForm.first_name} />
          <TextField label="Last name" onChange={(event) => updateRegisterField("last_name", event.target.value)} size="small" value={registerForm.last_name} />
          <TextField label="Location" onChange={(event) => updateRegisterField("location", event.target.value)} size="small" value={registerForm.location} />
          <TextField label="Description" onChange={(event) => updateRegisterField("description", event.target.value)} size="small" multiline value={registerForm.description} />
          <TextField label="Occupation" onChange={(event) => updateRegisterField("occupation", event.target.value)} size="small" value={registerForm.occupation} />
          <Button type="submit" variant="outlined">Register Me</Button>
        </form>
      )}
    </Stack>
  );
}

export default LoginRegister;
