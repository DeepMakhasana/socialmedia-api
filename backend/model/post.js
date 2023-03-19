const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    caption: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Please enter location."],
    },
    postImage: {
      type: String,
      required: [true, "Please Image upload."],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "account",
    },
    like: [String],
    comment: [
        {
            commentBy: {
              type: Schema.Types.ObjectId,
              ref: "account"
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]
  },
  { timestamps: true }
);


const Post = model("post", postSchema);

module.exports = Post;