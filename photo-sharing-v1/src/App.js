import './App.css';

import React, { useEffect, useState } from "react";
import { CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import LoginRegister from "./components/LoginRegister";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import fetchModel from "./lib/fetchModelData";

const App = () => {
  // State này lưu user đang đăng nhập; null nghĩa là chưa đăng nhập.
  const [currentUser, setCurrentUser] = useState(null);

  // State này cho biết frontend đã hỏi backend xem session còn đăng nhập hay chưa.
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        // Khối này hỏi backend: trình duyệt hiện tại còn session đăng nhập không.
        const user = await fetchModel("/admin/current");
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  function requireLogin(component) {
    // Khối này bảo vệ các trang /users và /photos khi user chưa đăng nhập.
    if (!authChecked) {
      return <Typography>Checking login...</Typography>;
    }

    return currentUser ? component : <Navigate to="/login" replace />;
  }

  return (
      <Router>
        <CssBaseline />
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList currentUser={currentUser} />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  {/* Route này hiển thị trang login/register. */}
                  <Route
                    path="/login"
                    element={<LoginRegister onLogin={setCurrentUser} />}
                  />
                  {/* Route gốc tự chuyển về trang user hiện tại hoặc trang login. */}
                  <Route
                    path="/"
                    element={
                      currentUser
                        ? <Navigate to={`/users/${currentUser._id}`} replace />
                        : <Navigate to="/login" replace />
                    }
                  />
                  {/* Route này hiển thị thông tin chi tiết của một user. */}
                  <Route
                      path="/users/:userId"
                      element={requireLogin(<UserDetail />)}
                  />
                  {/* Route này hiển thị toàn bộ ảnh và comment của một user. */}
                  <Route
                      path="/photos/:userId"
                      element={requireLogin(<UserPhotos currentUser={currentUser} />)}
                  />
                  {/* Route này hiển thị danh sách user trong vùng nội dung chính. */}
                  <Route
                    path="/users"
                    element={
                      currentUser
                        ? <UserList currentUser={currentUser} />
                        : <Navigate to="/login" replace />
                    }
                  />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
