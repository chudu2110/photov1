function requireLogin(request, response, next) {
  // Middleware này chặn mọi API cần đăng nhập.
  if (!request.session || !request.session.userId) {
    response.status(401).send("Please login first.");
    return;
  }

  // Khối này cho request đi tiếp nếu đã có userId trong session.
  next();
}

module.exports = requireLogin;
