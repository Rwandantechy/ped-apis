const { getCollection } = require("../database.js");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// Helper function to verify JWT tokens
const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

//_____________Create a new comment on a blog post__________/
const createComment = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");
    const commentsCollection = getCollection("comments");
    const usersCollection = getCollection("users");
    const { blogId, text, token } = req.body;

    // Verify the JWT token
    const decodedToken = verifyAuthToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    // Fetch the user details of the comment writer
    const commentWritter = await usersCollection.findOne({
      _id: new ObjectId(decodedToken._id),
    });

    if (!commentWritter) {
      return res.status(404).json({ error: "Comment writer not found." });
    }

    const comment = {
      blogId,
      text,
      commentWritter: {
        _id: commentWritter._id,
        name: commentWritter.name,
        username: commentWritter.username,
        email: commentWritter.email,
        location: commentWritter.location,
      },
      createdAt: new Date(),
      replies: [],
    };

    const result = await commentsCollection.insertOne(comment);

    // Add the comment's _id to the blog's comments array
    await blogsCollection.updateOne(
      { _id: new ObjectId(blogId) },
      {
        $push: {
          comments: {
            _id: result.insertedId,
            text: text,
            commentWritter: comment.commentWritter,
            createdAt: comment.createdAt,
            replies: [],
          },
        },
        $inc: { commentCount: 1 },
      }
    );

    res.status(201).json({
      message: "Comment created successfully.",
      comment: result.ops[0],
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a reply to a comment
const createReply = async (req, res) => {
  try {
    const commentsCollection = getCollection("comments");

    const { commentId, text, author, token } = req.body;

    // Verify the JWT token
    const decodedToken = verifyAuthToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const reply = {
      text,
      author,
      createdAt: new Date(),
    };

    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $push: { replies: reply } }
    );

    res.status(201).json({
      message: "Reply created successfully.",
      reply,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get comments for a specific blog post
const getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId, token } = req.params;
    const commentsCollection = getCollection("comments");

    // Verify the JWT token
    const decodedToken = verifyAuthToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const comments = await commentsCollection
      .find({ blogId: new ObjectId(blogId) })
      .toArray();

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get replies for a specific comment
const getRepliesByCommentId = async (req, res) => {
  try {
    const { commentId, token } = req.params;
    const commentsCollection = getCollection("comments");

    // Verify the JWT token
    const decodedToken = verifyAuthToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const comment = await commentsCollection.findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json({ replies: comment.replies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Edit a comment by its ID
const editComment = async (req, res) => {
  try {
    const commentsCollection = getCollection("comments");

    const { commentId, text, token } = req.body;

    // Verify the JWT token
    const decodedToken = verifyAuthToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const updatedComment = await commentsCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { text } },
      { returnDocument: "after" }
    );

    if (!updatedComment.value) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json({
      message: "Comment edited successfully.",
      comment: updatedComment.value,
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//___________________ Delete a comment by its ID______________________/
const deleteComment = async (req, res) => {
  try {
    const commentsCollection = getCollection("comments");
    const blogsCollection = getCollection("blogs");

    const { commentId, token } = req.params;

    // Verify the JWT token
    const decodedToken = verifyAuthToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    // Find the comment to be deleted
    const deletedComment = await commentsCollection.findOneAndDelete({
      _id: new ObjectId(commentId),
    });

    if (!deletedComment.value) {
      return res.status(404).json({ error: "Comment not found." });
    }

    // Remove the comment's _id from the associated blog's comments array
    await blogsCollection.updateOne(
      { _id: new ObjectId(deletedComment.value.blogId) },
      { $pull: { comments: new ObjectId(commentId) } }
    );

    // Delete all replies associated with the deleted comment
    if (deletedComment.value.replies.length > 0) {
      await commentsCollection.deleteMany({
        _id: {
          $in: deletedComment.value.replies.map(
            (reply) => new ObjectId(reply._id)
          ),
        },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createComment,
  createReply,
  getCommentsByBlogId,
  getRepliesByCommentId,
  editComment,
  deleteComment,
};
