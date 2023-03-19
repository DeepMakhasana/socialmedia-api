const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userDetail,
  deleteUser,
  updateUser,
  updateProfileImage,
  followAndUnfollow
} = require("../controller/account");


// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../socialmedia/backend/upload/profileImage");
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
router.route("/").delete(deleteUser).patch(updateUser);
router.post("/profile-image",  upload.single("profileImage"), updateProfileImage);
router.route("/follow/:id").patch(followAndUnfollow);

module.exports = router;
