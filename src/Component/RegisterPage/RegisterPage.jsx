import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    // Gửi đăng ký đến API (thay thế bằng mã xử lý gửi request đến API của bạn)
    fetch(`http://localhost:8080/api/register?username=${username}&password=${password}&email=${email}`)
      .then((response) => response.text())
      .then((data) => {
        if (data === "true") {
          alert("Đăng ký thành công");
          localStorage.setItem('token', "user");
          SaveIdLogin(username);
          navigate('/library')
        } else {
          alert("Trùng Username !!!");
        }
      })
      .catch((error) => {
        // Xử lý lỗi
        alert(error);
      });
  };
  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="register-btn" disabled={password !== confirmPassword}>Register</button>
        </form>
        <p className="text-center mt-3">
        Already have an account?{" "}
          <Link to="/library/login"  className="text-underline">Login</Link>
        </p>
      </div>
    </div>
  );
};
const SaveIdLogin = (username) => {
  // Gọi API để lấy thông tin id từ server
  fetch(`http://localhost:8080/api/getUserId?username=${username}`)
    .then((response) => response.json())
    .then((data) => {
      const userId = data;
      console.log(data)
      alert( data)
      localStorage.setItem('userId', userId);
      window.location.href = `/library`;
    })
    .catch((error) => {
      alert('Lỗi khi lấy thông tin id từ server');
      console.error(error);
    });
};
export default RegisterPage;