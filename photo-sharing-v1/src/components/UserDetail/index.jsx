import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import "./styles.css";
import { Link as RouterLink, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
    const { userId } = useParams();

    // State này lưu thông tin chi tiết của user đang xem.
    const [user, setUser] = useState(null);

    // State này lưu lỗi nếu backend không trả được user.
    const [error, setError] = useState("");

    useEffect(() => {
      let isMounted = true;

      async function loadUser() {
        try {
          // Khối này lấy user theo userId nằm trên URL.
          const userInfo = await fetchModel(`/user/${userId}`);
          if (isMounted) {
            setUser(userInfo);
            setError("");
          }
        } catch (error) {
          // Khối này hiển thị lỗi nếu userId sai hoặc session hết hạn.
          if (isMounted) {
            setUser(null);
            setError("Cannot load this user from backend.");
          }
        }
      }

      loadUser();

      return () => {
        isMounted = false;
      };
    }, [userId]);

    if (error) {
      return <Typography color="error">{error}</Typography>;
    }

    if (!user) {
      return <Typography>Loading user...</Typography>;
    }

    return (
        <Stack className="user-detail" spacing={2}>
          {/* Khối này hiển thị tên và mô tả chính của user. */}
          <div>
            <Typography variant="h4">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {user.occupation}
            </Typography>
          </div>

          {/* Khối này hiển thị các thông tin cơ bản. */}
          <div className="user-detail-info">
            <Typography><strong>Location:</strong> {user.location}</Typography>
            <Typography><strong>Description:</strong> {user.description}</Typography>
          </div>

          <Button
            className="user-detail-button"
            component={RouterLink}
            to={`/photos/${user._id}`}
            variant="contained"
          >
            View Photos
          </Button>
        </Stack>
    );
}

export default UserDetail;
