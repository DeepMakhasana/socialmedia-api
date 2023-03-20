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
      return next(new errorHandler("please enter caption.", 400));
    }
    if (!location) {
      return next(new errorHandler("please enter location.", 400));
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

    res.status(201).json({
      success: true,
      message: "Post Upload successfully.",
      post: createPost,
    });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Update post
// ======================
const updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const { caption, location } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(postId, {
    caption,
    location,
  });

  console.log(updatePost);

  res.status(200).json({
    success: true,
    message: "Post Update Successfully.",
    post: postId,
  });
};

// ======================
// Get post by id
// ======================
const getPostByID = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) return next(new errorHandler("Post Not Found!", 404));

    res.status(201).json({
      success: true,
      message: "post fetch successfully.",
      post,
    });
  } catch (error) {
    return next(new errorHandler("some thing wait wrong!", 400));
  }
};

// ======================
// Delete post
// ======================
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const createdBy = accountDetails._id;

    const deleteFromAccount = await Account.findOne({
      _id: createdBy,
    });

    if (deleteFromAccount.post.includes(postId)) {
      const index = deleteFromAccount.post.indexOf(postId);
      deleteFromAccount.post.splice(index, 1);
      const result = await deleteFromAccount.save();

      const deletePost = await Post.findByIdAndDelete(postId);

      if (!result || !deletePost) {
        return next(new errorHandler("Post not delete.", 400));
      }

      res.status(200).json({
        success: true,
        message: "Post Delete Successfully.",
        post: postId,
      });
    } else {
      return next(new errorHandler("You not able to delete.", 400));
    }
  } catch (error) {
    return next(new errorHandler("some thing wait wrong!", 400));
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

    if (!comment) {
      next(new errorHandler("Please enter comment message.", 400));
    }

    const findPost = await Post.findById(postId);

    if (!findPost) {
      next(new errorHandler("Please enter valid post id.", 400));
    }

    const comments = { commentBy, comment };
    findPost.comment.push(comments);
    await findPost.save();

    res.status(201).json({
      success: true,
      message: "Comment Upload successfully.",
      post: { postId, commentBy },
    });
  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

// ======================
// Get post by following & follower
// ======================
const getPostByFollowerAndFollowing = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const myId = accountDetails._id;

    const myFollowerAndFollowing = await Account.findById(myId);

    if (!myFollowerAndFollowing) return next(new errorHandler("some thing wait wrong!", 400));

    const FollowerAndFollowingPostId = [
      ...myFollowerAndFollowing.follower,
      ...myFollowerAndFollowing.following,
    ];

    const getPostByFollowerAndFollowing = await Post.find({
      createdBy: { $in: FollowerAndFollowingPostId },
    });

    if (!myFollowerAndFollowing)
      return next(
        new errorHandler("No post found please follow peoples...", 200)
      );

    res.status(201).json({
      success: true,
      message: "Posts Fetch successfully.",
      FollowerAndFollowing: FollowerAndFollowingPostId,
      posts: getPostByFollowerAndFollowing,
    });
  } catch (error) {
    next(new errorHandler("some thing wait wrong!", 400));
  }
};

// ======================
// Post like and unlike
// ======================
const updateLikeUnlike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const token = req.cookies.token;
    const accountDetails = verifyToken(token);
    const myId = accountDetails._id;

    const updateLikeUnlike = await Post.findOne({ _id: postId });
    if(!updateLikeUnlike) return next(new errorHandler("Post not found!", 400)); 

    if (updateLikeUnlike.like.includes(myId)) {
      const index = updateLikeUnlike.like.indexOf(myId);
      updateLikeUnlike.like.splice(index, 1);
      await updateLikeUnlike.save();

      res.status(200).json({
        success: true,
        message: "unlike",
        postId,
      });
    } else {
      updateLikeUnlike.like.push(myId);
      await updateLikeUnlike.save();

      res.status(200).json({
        success: true,
        message: "like",
        postId,
      });
    }

  } catch (error) {
    next(new errorHandler(error.message, 400));
  }
};

module.exports = {
  createPost,
  getPostByID,
  createComment,
  getPostByFollowerAndFollowing,
  updatePost,
  deletePost,
  updateLikeUnlike,
};
