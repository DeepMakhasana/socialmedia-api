const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userDetail,
  myDetail,
  deleteUser,
  updateUser,
  updateProfileImage,
  followAndUnfollow,
  forgotPassword,
  resetPassword,
} = require("../controller/account");

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/upload/postImage");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// router
router.route("/register").post(userRegister);

router.route("/login").post(userLogin);

router.route("/:username").get(userDetail);

router.route("/").get(myDetail).put(updateUser).delete(deleteUser);

router.patch("/profile-image", upload.single("profileImage"), updateProfileImage);

router.route("/follow/:id").put(followAndUnfollow);

router.route("/forgot/password").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
