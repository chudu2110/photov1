const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

async function handleResponse(response) {
  // Khối này đổi response lỗi từ backend thành Error dễ đọc ở frontend.
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * fetchModel - Lấy dữ liệu từ backend bằng HTTP GET.
 *
 * @param {string} url Đường dẫn API cần gọi, ví dụ: /user/list.
 */
async function fetchModel(url) {
  // Khối này luôn gửi kèm cookie session để backend biết user nào đang đăng nhập.
  const response = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
  });

  return handleResponse(response);
}

async function postModel(url, body = {}) {
  // Khối này gửi dữ liệu JSON cho login, logout, register và comment.
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

async function uploadModel(url, formData) {
  // Khối này gửi FormData vì upload ảnh không dùng JSON thông thường.
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleResponse(response);
}

export { API_BASE_URL, postModel, uploadModel };
export default fetchModel;
