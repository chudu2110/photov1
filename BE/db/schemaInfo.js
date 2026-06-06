const mongoose = require("mongoose");

// Schema này lưu thông tin phiên bản dữ liệu mẫu đã load vào database.
const schemaInfo = new mongoose.Schema({
  version: String,
  load_date_time: { type: Date, default: Date.now },
});

// Model này cho phép query collection SchemaInfo.
const SchemaInfo = mongoose.model("SchemaInfo", schemaInfo);

// Dòng này export model để router và dbLoad có thể dùng.
module.exports = SchemaInfo;
