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

    if (file.fieldname === "photos") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images are allowed for hostel picture"));
      }
      return cb(null, true);
    }

    if (file.fieldname === "menuImage") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images are allowed for menu item"));
      }
      return cb(null, true);
    }

    if (file.fieldname === "proof") {
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new Error(
            "Only PDF, Word documents, and image files are allowed for proof"
          )
        );
      }

      return cb(null, true);
    }

    return cb(null, false);
  },
});
