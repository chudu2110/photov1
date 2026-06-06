import React, { useEffect, useState } from "react";
import { Button, Divider, Link, Stack, TextField, Typography } from "@mui/material";

import "./styles.css";
import { Link as RouterLink, useParams } from "react-router-dom";
import fetchModel, { API_BASE_URL, postModel } from "../../lib/fetchModelData";

function formatDate(dateTime) {
  // Hàm này đổi ngày giờ thô từ database thành chuỗi dễ đọc.
  return new Date(dateTime).toLocaleString();
}

function getImagePath(fileName) {
  // Hàm này tạo đường dẫn ảnh từ backend thay vì import ảnh local trong frontend.
  return `${API_BASE_URL}/images/${fileName}`;
}

function UserPhotos ({ currentUser }) {
    const { userId } = useParams();

    // State này lưu danh sách ảnh của user đang xem.
    const [photos, setPhotos] = useState([]);

    // State này lưu thông tin chủ sở hữu của các ảnh.
    const [user, setUser] = useState(null);

    // State này lưu lỗi nếu backend không trả được ảnh.
    const [error, setError] = useState("");

    // State này lưu nội dung comment đang gõ, tách theo từng photoId.
    const [commentText, setCommentText] = useState({});

    useEffect(() => {
      let isMounted = true;

      async function loadPhotos() {
        try {
          // Khối này lấy song song thông tin user và danh sách ảnh của user.
          const [userInfo, userPhotos] = await Promise.all([
            fetchModel(`/user/${userId}`),
            fetchModel(`/photosOfUser/${userId}`),
          ]);

          if (isMounted) {
            setUser(userInfo);
            setPhotos(userPhotos);
            setError("");
          }
        } catch (error) {
          // Khối này hiển thị lỗi nếu API ảnh bị lỗi hoặc session hết hạn.
          if (isMounted) {
            setUser(null);
            setPhotos([]);
            setError("Cannot load photos from backend.");
          }
        }
      }

      loadPhotos();

      return () => {
        isMounted = false;
      };
    }, [userId]);

    async function handleAddComment(photoId) {
      // Hàm này xử lý khi người dùng bấm Add Comment dưới một ảnh.
      const comment = commentText[photoId] || "";

      try {
        // Khối này gửi comment mới của user hiện tại lên backend.
        await postModel(`/commentsOfPhoto/${photoId}`, { comment });

        // Khối này tải lại danh sách ảnh để comment mới hiện ngay trên màn hình.
        const userPhotos = await fetchModel(`/photosOfUser/${userId}`);
        setPhotos(userPhotos);
        setCommentText({
          ...commentText,
          [photoId]: "",
        });
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    if (error) {
      return <Typography color="error">{error}</Typography>;
    }

    if (!user) {
      return <Typography>Loading photos...</Typography>;
    }

    return (
      <Stack className="user-photos" spacing={3}>
        <div>
          <Typography variant="h4">
            Photos of {user.first_name} {user.last_name}
          </Typography>
          <Typography color="text.secondary">
            {photos.length} photo{photos.length === 1 ? "" : "s"}
          </Typography>
        </div>

        {/* Khối này hiển thị từng ảnh cùng ngày tạo và comment của ảnh đó. */}
        {photos.map((photo) => (
          <div className="photo-card" key={photo._id}>
            <img
              alt={`${user.first_name} ${user.last_name}`}
              className="photo-image"
              src={getImagePath(photo.file_name)}
            />

            <Typography className="photo-date" color="text.secondary">
              Uploaded: {formatDate(photo.date_time)}
            </Typography>

            <Divider />

            <Stack className="photo-comments" spacing={1.5}>
              <Typography variant="h6">Comments</Typography>

              {(photo.comments || []).length === 0 && (
                <Typography color="text.secondary">No comments yet.</Typography>
              )}

              {/* Khối này hiển thị từng comment và link tới người viết comment. */}
              {(photo.comments || []).map((comment) => (
                <div className="comment-box" key={comment._id}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(comment.date_time)}
                  </Typography>
                  <Typography>
                    {comment.user ? (
                      <Link component={RouterLink} to={`/users/${comment.user._id}`}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    ) : (
                      "Unknown User"
                    )}
                    {": "}
                    {comment.comment}
                  </Typography>
                </div>
              ))}

              {currentUser && (
                // Khối này hiển thị ô nhập comment cho user đã đăng nhập.
                <div className="comment-form">
                  <TextField
                    label="Add a comment"
                    multiline
                    onChange={(event) =>
                      setCommentText({
                        ...commentText,
                        [photo._id]: event.target.value,
                      })
                    }
                    size="small"
                    value={commentText[photo._id] || ""}
                  />
                  <Button
                    onClick={() => handleAddComment(photo._id)}
                    variant="contained"
                  >
                    Add Comment
                  </Button>
                </div>
              )}
            </Stack>
          </div>
        ))}
      </Stack>
    );
}

export default UserPhotos;
