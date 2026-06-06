function normalizeApiUrl(url) {
  // Hàm này bỏ dấu / cuối URL để tránh bị double slash khi gọi API.
  return url.replace(/\/$/, "");
}

function getApiBaseUrl() {
  // Khối này lấy backend URL từ query ?api=... và lưu vào localStorage.
  const searchParams = new URLSearchParams(window.location.search);
  const apiUrlFromQuery = searchParams.get("api");

  if (apiUrlFromQuery) {
    localStorage.setItem("PHOTO_APP_API_BASE_URL", apiUrlFromQuery);
    return normalizeApiUrl(apiUrlFromQuery);
  }

  // Khối này ưu tiên backend URL đã lưu từ lần mở trước.
  const savedApiUrl = localStorage.getItem("PHOTO_APP_API_BASE_URL");

  if (savedApiUrl) {
    return normalizeApiUrl(savedApiUrl);
  }

  // Khối này đọc backend URL từ file .env của frontend.
  const envApiUrl = process.env.REACT_APP_API_BASE_URL;

  if (envApiUrl && envApiUrl !== "auto") {
    return normalizeApiUrl(envApiUrl);
  }

  // Khối này hỗ trợ chạy local nhanh nếu không cấu hình gì thêm.
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8081";
  }

  throw new Error("Chưa cấu hình backend URL. Hãy mở frontend với ?api=https://URL-BACKEND hoặc sửa REACT_APP_API_BASE_URL trong .env.");
}

const API_BASE_URL = getApiBaseUrl();

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
