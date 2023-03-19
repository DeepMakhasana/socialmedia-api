const Account = require("../model/account");
const Post = require("../model/post");
const { verifyToken } = require("../util/auth");
const errorHandler = require("../util/errorHandler");

// ======================
// create post
// ======================
const createPost = async (req, res, next) => {
  try {
    const { caption, location } = req.body;

    if (!caption) {
      next(new errorHandler("please enter caption.", 400));
    }
    if (!location) {
      next(new errorHandler("please enter location.", 400));
    }

    if (!req.file) {
      return next(new errorHandler("please select post image.", 400));
    }

    const postImage = req.file.filename;

    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const createdBy = accountDetails._id;

    const post = {
      caption,
      location,
      postImage,
      createdBy,
    };

    const createPost = await Post.create(post);

    if (!createPost) {
      next(new errorHandler("some thing wait wrong!", 400));
    }

    const addPostInAccount = await Account.findOne({ _id: createdBy });
    addPostInAccount.post.push(createPost._id);
    await addPostInAccount.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Post Upload successfully.",
        post: createPost,
      });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// create Comment
// ======================
const createComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const commentBy = accountDetails._id;
    const { comment } = req.body;

    if(!comment) {
      next(new errorHandler("Please enter comment message.", 400));
    }
    
    const findPost = await Post.findById(postId);
    
    if (!findPost) {
      next(new errorHandler("Please enter valid post id.", 400));
    }

    const comments = { commentBy, comment };
    findPost.comment.push(comments);
    await findPost.save();

    res
    .status(201)
    .json({
      success: true,
      message: "Comment Upload successfully.",
      post: {postId, commentBy},
    });
    
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
}




module.exports = {
  createPost,
  createComment
};
