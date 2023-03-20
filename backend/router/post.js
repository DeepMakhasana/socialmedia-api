const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createPost,
  getPostByID,
  createComment,
  getPostByFollowerAndFollowing,
  updatePost,
  deletePost,
  updateLikeUnlike
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
router.route("/:postId").get(getPostByID).patch(updatePost).delete(deletePost);
router.patch("/comment/:postId", createComment);
router.get("/", getPostByFollowerAndFollowing);
router.patch("/like/:postId", updateLikeUnlike);

module.exports = router;
