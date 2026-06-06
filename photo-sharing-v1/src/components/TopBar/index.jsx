import React, { useEffect, useState } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel, { postModel, uploadModel } from "../../lib/fetchModelData";

function TopBar ({ currentUser, onLogout }) {
    const location = useLocation();
    const navigate = useNavigate();

    // State này lưu dòng chữ bên phải TopBar theo trang đang mở.
    const [contextText, setContextText] = useState("User List");

    useEffect(() => {
      let isMounted = true;
      const pathParts = location.pathname.split("/");
      const page = pathParts[1];
      const userId = pathParts[2];

      async function loadTopBarContext() {
        // Khối này hiển thị trạng thái chưa đăng nhập.
        if (!currentUser) {
          setContextText("Please Login");
          return;
        }

        // Khối này dùng khi URL không có userId, ví dụ /users.
        if (!userId) {
          setContextText("User List");
          return;
        }

        try {
          // Khối này lấy tên user từ backend để TopBar biết đang xem ai.
          const user = await fetchModel(`/user/${userId}`);
          const fullName = `${user.first_name} ${user.last_name}`;

          if (!isMounted) {
            return;
          }

          if (page === "photos") {
            // Khối này đổi tiêu đề khi đang xem trang ảnh của user.
            setContextText(`Photos of ${fullName}`);
          } else {
            // Khối này đổi tiêu đề khi đang xem trang chi tiết user.
            setContextText(fullName);
          }
        } catch (error) {
          if (isMounted) {
            setContextText("Backend data unavailable");
          }
        }
      }

      loadTopBarContext();

      return () => {
        isMounted = false;
      };
    }, [currentUser, location.pathname]);

    async function handleLogout() {
      // Hàm này xử lý khi người dùng bấm Logout.
      try {
        // Khối này xóa session ở backend.
        await postModel("/admin/logout");
      } catch (error) {
        // Nếu session đã hết hạn, frontend vẫn cho quay về màn login.
      }

      // Khối này xóa user ở frontend và chuyển về trang login.
      onLogout();
      navigate("/login");
    }

    async function handlePhotoUpload(event) {
      // Hàm này xử lý khi người dùng chọn file ở nút Add Photo.
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append("uploadedphoto", file);

      // Khối này upload ảnh mới lên backend.
      await uploadModel("/photos/new", formData);
      event.target.value = "";

      // Khối này chuyển sang trang ảnh của user hiện tại để thấy ảnh vừa thêm.
      navigate(`/photos/${currentUser._id}`);
    }

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar className="topbar-toolbar">
          <Typography variant="h6" color="inherit">
            Vu Huy Du
          </Typography>
          <div className="topbar-right">
            <Typography variant="subtitle1" color="inherit">
              {contextText}
            </Typography>
            {currentUser && (
              <>
                {/* Khối này chỉ hiện khi đã đăng nhập. */}
                <Typography variant="body2" color="inherit">
                  Hi {currentUser.first_name}
                </Typography>
                <Button className="topbar-button" component="label" color="inherit">
                  Add Photo
                  <input hidden type="file" accept="image/*" onChange={handlePhotoUpload} />
                </Button>
                <Button className="topbar-button" color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
