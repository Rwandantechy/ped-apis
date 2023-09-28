import multer from "multer";
import fs from "fs";
import moment from "moment-timezone";

const storage = multer.diskStorage({  destination: function (req, file, cb) {
  const uploadDir = "blogImages/";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  cb(null, uploadDir);
},
filename: function (req, file, cb) {
  const originalName = file.originalname;
  const timezone = "Asia/Kolkata";
  const currentDateTime = moment().tz(timezone).format("YYYYMMDD_HHmmss.SSS");
  const fileName = currentDateTime + "_" + originalName;
  cb(null, fileName);
},
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = ["image/jpeg", "image/png"]; 

    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
});

export default upload;
