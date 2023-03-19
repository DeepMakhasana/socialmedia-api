const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name."],
    },
    userName: {
      type: String,
      required: [true, "Please Generate your User Name."],
      unique: [true, "This User Name is already."],
    },
    email: {
      type: String,
      required: [true, "Please Enter your email."],
      unique: [true, "This User is already exist."],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please Enter your Phone Number."],
      unique: [true, "This mobile number is already exist."],
      minLength: [10, "Enter valid mobile number."],
      maxLength: [10, "Enter valid mobile number."],
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please Enter your email."],
    },
    bio: {
      type: String,
      maxLength: [255, "max creates limit is 255 create."],
      default: " "
    },
    profileImage: {
      type: String,
      default: "default-profile-image.png",
    },
    link: [String],
    accountType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: "account",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "account",
      },
    ],
  },
  {
    timestamps: true,
  }
);

accountSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    next();
  }

  const salt = randomBytes(16).toString();
  const createHashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = createHashPassword;

  next();
});

accountSchema.static("checkPassword", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    return { message: "User is not exist." };
  }

  const salt = user.salt;
  const hashPassword = user.password;

  const hashPasswordUserProvide = await createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashPassword === hashPasswordUserProvide) {
    const tokenData = {
      _id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountType: user.accountType,
    };
    return tokenData;
  } else {
    return { message: "Invalid Password." };
  }
});

const Account = model("account", accountSchema);

module.exports = Account;
