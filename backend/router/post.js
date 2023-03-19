const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createPost,
  createComment
} = require("../controller/post");


// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../socialmedia/backend/upload/postImage");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });


// router
router.post("/",  upload.single("postImage"), createPost);
router.patch("/comment/:postId", createComment);

module.exports = router;
