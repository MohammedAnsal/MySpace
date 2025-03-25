import multer from "multer";
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profile") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images are allowed for profile picture"));
      }
      return cb(null, true);
    }

    if (file.fieldname == "photos") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images are allowed for hostel picture"));
      }
      return cb(null, true);
    }

    return cb(null, false);
  },
});
