const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createPost,
  getPostByID,
  createComment,
  deleteComment,
  getPostByFollowerAndFollowing,
  updatePost,
  deletePost,
  updateLikeUnlike,
} = require("../controller/post");

// multer setup
const storage = multer.diskStorage({
  destination: "./public/uploads/postImages",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// router
router.post("/", upload.single("postImage"), createPost);
router.route("/:postId").get(getPostByID).put(updatePost).delete(deletePost);
router.route("/comment/:postId").put(createComment);
router.route("/comment/:postId/:commentId").delete(deleteComment);
router.get("/", getPostByFollowerAndFollowing);
router.put("/like/:postId", updateLikeUnlike);

module.exports = router;
