const Account = require("../model/account");
const { createToken, verifyToken } = require("../util/auth");
const errorHandler = require("../util/errorHandler");

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
        username: userResult.userName,
      });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Account details
// ======================
const userDetail = async (req, res, next) => {
  try {
    const userName = req.params.username;

    const user = await Account.findOne({ userName: userName });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User is not exist.",
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
const deleteUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const accountDeleteId = accountDetails._id;

    const deleteAccount = await Account.findByIdAndDelete(accountDeleteId);

    if (!deleteAccount) {
      return res.status(200).json({
        success: false,
        message: "some thing wait wrong!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account delete successfully.",
      accountDeleteName: deleteAccount.name,
    });

  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Update Account
// ======================
const updateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const accountUpdateId = accountDetails._id;

    const { name, userName, bio, accountType, link } = req.body;
    const updateData = { name, userName, bio, accountType, $push: { link } };

    const updateAccount = await Account.findByIdAndUpdate(accountUpdateId, updateData);

    if (!updateAccount) {
      return res.status(200).json({
        success: false,
        message: "some thing wait wrong!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account Update successfully.",
      accountDeleteName: updateAccount.name,
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
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const accountUpdateId = accountDetails._id;
    const profileImageURL = req.file.filename;

    const uploadImageURL = await Account.findByIdAndUpdate(accountUpdateId, { profileImage: profileImageURL });

    if(!uploadImageURL){
      return res.status(400).json({
        success: false,
        message: "Not fail to upload!"
      })
    }

    res.status(200).json({
      success: true,
      message: "Profile Image update successfully."
    })

  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
}


// ===========================
// Follow and Unfollow
// ===========================
const followAndUnfollow = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const myId = accountDetails._id;
    const followerId = req.params.id;

    const myAccount = await Account.findOne({ _id: myId });
    const FollowerAccount = await Account.findOne({ _id: followerId });

    if(!myAccount || !FollowerAccount){
      return res.status(400).json({
        success: false,
        message: "User Not exist!"
      })
    }

    if(myAccount.following.includes(followerId)){
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
        followerId: followerId
      })
    }else{
      myAccount.following.push(followerId);
      FollowerAccount.follower.push(myId);

      await myAccount.save();
      await FollowerAccount.save();

      res.status(200).json({
        success: true,
        message: "User followed.",
        myId: myId,
        followerId: followerId
      })
    }

  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
}


module.exports = {
  userRegister,
  userLogin,
  userDetail,
  deleteUser,
  updateUser,
  updateProfileImage,
  followAndUnfollow
};
