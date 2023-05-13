const Account = require("../model/account");
const Post = require("../model/post");
const { createToken, verifyToken } = require("../util/auth");
const errorHandler = require("../util/errorHandler");
const sendEmail = require("../middleware/sendEmail");
const crypto = require("crypto");

// ==============
// register
// ==============
const userRegister = async (req, res, next) => {
  try {
    const { name, userName, email, phoneNumber, password } = req.body;

    if (!name || !userName || !email || !phoneNumber || !password) {
      next(new errorHandler("please fill all details.", 400));
    }

    await Account.create({ name, userName, email, phoneNumber, password });

    res
      .status(201)
      .json({ success: true, message: "Register Successfully..." });
  } catch (error) {
    if (error.code === 11000) {
      const errorValue = Object.keys(error.keyValue);
      return next(new errorHandler(errorValue[0], error.code));
    }

    next(new errorHandler(error._message, 400));
  }
};

// ==============
// login
// ==============
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userResult = await Account.checkPassword(email, password);

    if (Object.keys(userResult)[0] === "message") {
      return next(new errorHandler(userResult.message, 400));
    }

    const token = createToken(userResult);

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Login Successfully.",
        user: userResult,
      });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// My Account details
// ======================
const myDetail = async (req, res, next) => {
  try {
    if (!req.cookies.token)
      return next(new errorHandler("First Login please.", 400));
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const myId = accountDetails._id;

    const user = await Account.findOne({ _id: myId });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User is not Found.",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Friends Account details
// ======================
const userDetail = async (req, res, next) => {
  try {
    const userName = req.params.username;

    const user = await Account.findOne({ userName: userName });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User is not Found.",
      });
    }

    res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Delete Account
// ======================
// TODO
const deleteUser = async (req, res, next) => {
  try {
    if (!req.cookies.token)
      return next(new errorHandler("First Login please.", 400));
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const accountDeleteId = accountDetails._id;

    const deleteAccount = await Account.findByIdAndDelete(accountDeleteId);

    if (deleteAccount == null) {
      return res.status(200).json({
        success: false,
        message: "Account already deleted.",
      });
    } else {
      // all post delete
      for (let i = 0; i < deleteAccount.post.length; i++) {
        const element = deleteAccount.post[i];
        await Post.findByIdAndDelete(element);
        console.log("post", element);
      }

      // all follower delete from anther user
      for (let i = 0; i < deleteAccount.following.length; i++) {
        const element = deleteAccount.following[i];
        const deleteFollower = await Account.findOne(element);

        const index = deleteFollower.follower.indexOf(element);
        deleteFollower.follower.splice(index, 1);
        await deleteFollower.save();
        console.log("Following", element);
      }

      // all following delete from anther user
      for (let i = 0; i < deleteAccount.follower.length; i++) {
        const element = deleteAccount.follower[i];
        const deleteFollowing = await Account.findOne(element);

        const index = deleteFollowing.following.indexOf(element);
        deleteFollowing.following.splice(index, 1);
        await deleteFollowing.save();
        console.log("Follower", element);
      }

      if (!deleteAccount) {
        return res.status(200).json({
          success: false,
          message: "some thing wait wrong!",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Account delete successfully.",
        accountDeleteName: deleteAccount.userName,
      });
    }
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Update Account
// ======================
const updateUser = async (req, res, next) => {
  try {
    if (!req.cookies.token)
      return next(new errorHandler("First Login please.", 400));
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const accountUpdateId = accountDetails._id;

    const { name, userName, bio, accountType, link } = req.body;
    const updateData = { name, userName, bio, accountType, $push: { link } };

    const updateAccount = await Account.findByIdAndUpdate(
      accountUpdateId,
      updateData
    );

    if (!updateAccount) {
      return res.status(200).json({
        success: false,
        message: "some thing wait wrong!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account Update successfully.",
    });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ===========================
// Update Profile Image
// ===========================
const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.cookies.token)
      return next(new errorHandler("First Login please.", 400));
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const accountUpdateId = accountDetails._id;
    const profileImageURL = req.file.filename;

    const uploadImageURL = await Account.findByIdAndUpdate(accountUpdateId, {
      profileImage: profileImageURL,
    });

    if (!uploadImageURL) {
      return res.status(400).json({
        success: false,
        message: "Not fail to upload!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Image update successfully.",
    });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ===========================
// Follow and Unfollow
// ===========================
const followAndUnfollow = async (req, res, next) => {
  try {
    if (!req.cookies.token)
      return next(new errorHandler("First Login please.", 400));
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const myId = accountDetails._id;
    const followerId = req.params.id;

    const myAccount = await Account.findOne({ _id: myId });
    const FollowerAccount = await Account.findOne({ _id: followerId });

    if (!myAccount || !FollowerAccount) {
      return res.status(400).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (myAccount.following.includes(followerId)) {
      const myIndex = myAccount.following.indexOf(followerId);
      myAccount.following.splice(myIndex, 1);

      const followerIndex = FollowerAccount.follower.indexOf(myId);
      FollowerAccount.follower.splice(followerIndex, 1);

      await myAccount.save();
      await FollowerAccount.save();

      return res.status(200).json({
        success: true,
        message: "User Unfollowed.",
        myId: myId,
        followerId: followerId,
      });
    } else {
      myAccount.following.push(followerId);
      FollowerAccount.follower.push(myId);

      await myAccount.save();
      await FollowerAccount.save();

      res.status(200).json({
        success: true,
        message: "User followed.",
        myId: myId,
        followerId: followerId,
      });
    }
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ===========================
// forgot password
// ===========================
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await Account.findOne({ email });

    if (!user) return next(new errorHandler("Enter valid email id."));

    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/account/password/reset/${resetPasswordToken}`;

    const message = `Reset Your password by clicking on the link below: \n \n ${resetURL}`;

    try {
      const option = {
        email: user.email,
        subject: "Reset Password",
        message,
      };

      await sendEmail(option);

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ===========================
// forgot password
// ===========================
const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    if (!token) return next(new errorHandler("Enter reset token.", 400));
    const { newPassword } = req.body;
    if (!newPassword) return next(new errorHandler("Enter new password.", 400));

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const checkResetPasswordToken = await Account.findOne({
      resetPasswordToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!checkResetPasswordToken) {
      return next(new errorHandler("Invalid token or Expire token.", 400));
    }

    checkResetPasswordToken.password = newPassword;
    checkResetPasswordToken.resetPasswordToken = undefined;
    checkResetPasswordToken.resetTokenExpire = undefined;

    await checkResetPasswordToken.save();

    res.status(200).json({
      success: true,
      message: "Password update successfully.",
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
};

module.exports = {
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
};
