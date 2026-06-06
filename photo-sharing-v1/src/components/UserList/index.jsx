import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList ({ currentUser }) {
    // State này lưu danh sách user lấy từ backend.
    const [users, setUsers] = useState([]);

    // State này lưu lỗi nếu backend không trả được danh sách user.
    const [error, setError] = useState("");

    useEffect(() => {
      let isMounted = true;

      async function loadUsers() {
        // Khối này không gọi API khi chưa đăng nhập.
        if (!currentUser) {
          setUsers([]);
          return;
        }

        try {
          // Khối này lấy danh sách user để hiển thị ở sidebar.
          const userList = await fetchModel("/user/list");
          if (isMounted) {
            setUsers(userList);
            setError("");
          }
        } catch (error) {
          // Khối này báo lỗi nếu backend hoặc session có vấn đề.
          if (isMounted) {
            setUsers([]);
            setError("Cannot load users from backend.");
          }
        }
      }

      loadUsers();

      return () => {
        isMounted = false;
      };
    }, [currentUser]);

    return (
      <div className="user-list">
        <Typography className="user-list-title" variant="h6">
          Users
        </Typography>

        {!currentUser && (
          <Typography className="user-list-empty" color="text.secondary" variant="body2">
            Login to view users.
          </Typography>
        )}

        {error && (
          <Typography className="user-list-error" color="error" variant="body2">
            {error}
          </Typography>
        )}

        <List className="user-list-nav" component="nav">
          {/* Khối này tạo từng link để bấm vào tên user và xem trang chi tiết. */}
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to={`/users/${user._id}`}>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
