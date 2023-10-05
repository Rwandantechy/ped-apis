import { getCollection } from "../database.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function to generate JWT tokens
const generateAuthToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ _id: user._id, email: user.email }, secretKey, {
    JWT_EXPIRES_IN,
  });
};

// Helper function to verify JWT tokens
const verifyAuthToken = (token) => {
  const jwtSecret = process.env.JWT_SECRET;

  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

// Helper function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

//________ Create a new user_______________________/
export const createUser = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const userData = req.body;

    // Check if the email already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }
    // Hash the password
    userData.password = await hashPassword(userData.password);

    // Insert the user into the database
    const result = await usersCollection.insertOne(userData);

    // Generate a JWT token for the new user
    const token = generateAuthToken(result.ops[0]);

    // Create a user object with selected fields for response
    const createdUser = {
      _id: result.insertedId,
      username: result.ops[0].username,
      email: result.ops[0].email,
    };

    res.status(201).json({
      message: "User registered successfully.",
      user: createdUser,
      token: token,
    });
  } catch (error) {
    console.error("Error making the registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//_______________ Login as a user_______________/
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersCollection = getCollection("users");

    // Find the user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate a JWT token for the logged-in user
    const token = generateAuthToken(user);

    res.status(200).json({
      message: "User logged in successfully.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//_____ Get user one's self profile using their own ID_______/

export const getUserById = async (req, res) => {
  try {
    const userId = `${req.params.id}`;
    const usersCollection = getCollection("users");

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ObjectId." });
    }

    //  authenticating the user by verifying the JWT token
    const authToken = req.headers.authorization;
    const decodedToken = verifyAuthToken(authToken);

    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    // Ensure that the user is requesting their own profile
    if (decodedToken._id !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden. You can only access your own profile." });
    }

    // Fetch the user data from the database
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        followers: user.followers,
        likes: user.likes,
        comments: user.comments,
        blogs: user.blogs,
      },
    });
  } catch (error) {
    console.error("Error fetching a user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//________________ Search for users by username or email and retrieve their blogs______/
export const searchUsersWithBlogs = async (req, res) => {
  try {
    const query = req.query.q;
    const usersCollection = getCollection("users");
    const blogsCollection = getCollection("blogs");

    // Use a MongoDB query to find users with matching usernames or emails
    const searchResults = await usersCollection
      .find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({ message: "No matching users found." });
    }

    // Retrieve blogs for each user
    const usersWithBlogs = await Promise.all(
      searchResults.map(async (user) => {
        // Find blogs associated with the user based on bloggerName
        const userBlogs = await blogsCollection
          .find({ bloggerName: user.username })
          .toArray();

        return {
          user: {
            _id: user._id,
            username: user.username,
            },
          blogs: userBlogs,
        };
      })
    );

    // Return the search results with user details and associated blogs
    res.status(200).json({
      message: "Users found matching the search query with their blogs.",
      users: usersWithBlogs,
    });
  } catch (error) {
    console.error("Error searching for users with blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user by ID
export const updateUserById = async (req, res) => {
  const id = `${req.params.id}`;
  const userUpdatedData = { ...req.body };

  try {
    const usersCollection = getCollection("users");

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId." });
    }

    if (userUpdatedData.password) {
      // If the password is being updated, hash it
      userUpdatedData.password = await hashPassword(userUpdatedData.password);
    }

    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: userUpdatedData },
      { returnDocument: "after" }
    );

    if (updatedUser === null) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      user: {
        updatedUser,
      },
    });
  } catch (error) {
    console.error("Error updating a user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
  const id = `${req.params.id}`;

  try {
    const usersCollection = getCollection("users");

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId." });
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting a user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

};

// ________________Follow a user (blogger)______________/
export const followUser = async (req, res) => {
  try {
    // The user performing the follow
    const currentUserId = req.params.userId;
    // The blogger to be followed 
    const followedUserId = req.body.followedUserId;

    const usersCollection = getCollection("users");

    // Update the followed blogger's document to increment followers count and add follower's info
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(followedUserId) },
      {
        $inc: { followersCount: 1 },
        $push: {
          followers: {
            userId: currentUserId,
            username: req.user.username, 
            email: req.user.email,
          },
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Blogger not found." });
    }

    // Return a success response
    res.status(201).json({
      message: "User followed successfully.",
    });
  } catch (error) {
    console.error("Error following a blogger:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



//________________ Unfollow a user (blogger)______________/
export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.params.userId; 
    const unfollowedUserId = req.body.unfollowedUserId; 

    const usersCollection = getCollection("users");

    // Update the unfollowed blogger's document to decrement followers count and remove follower's info
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(unfollowedUserId) },
      {
        $inc: { followersCount: -1 },
        $pull: {
          followers: { userId: currentUserId },
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Blogger not found." });
    }

    // Return a success response
    res.status(200).json({
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    console.error("Error unfollowing a blogger:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//______________ Report content____________________/
export const reportContent = async (req, res) => {
  try {
    const { blogId, bloggerId, reason } = req.body;

    // Implement your logic to store the content report in the admin_reported-content document
    const reportedCollection = getCollection("reportedContent");

    const reportData = {
      blogId,
      bloggerId,
      reporterId: req.user._id, 
      reporterName: req.user.username,
      reporterEmail: req.user.email,
      reason,
    };

    const result = await reportedCollection.insertOne(reportData);

    // Return a success response
    res.status(201).json({
      message: "Content reported successfully.",
      repotedBlog:result,
    });
  } catch (error) {
    console.error("Error reporting content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
