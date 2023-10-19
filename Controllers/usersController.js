import { getCollection } from "../database.js";
import { generateAuthToken, verifyAuthToken } from "../Middlewares/jwtAuth.js";
import { hashInputData } from "../Middlewares/hashInputData.js";
import { transporter } from "../Middlewares/nodemailerFunction.js";
import { ObjectId } from "mongodb";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import ejs from "ejs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { get } from "http";

//_________________ Get all users____________________/

export const createUser = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const userVerificationsCollection = getCollection("userVerifications");

    const userData = req.body;
    // Check if the email already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists. you can now login" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await hashInputData(req.body.password);

    // add hashed password to the user data
    userData.password = hashedPassword;
    // Add 'emailVerified' as false
    userData.emailVerified = false;

    // Insert the user into the users collection
    const result = await usersCollection.insertOne(userData);

    // Create a user object with selected fields for response
    const createdUser = {
      _id: result.insertedId,
      username: result.username,
      email: result.email,
      emailVerified: result.emailVerified,
    };

    // Current URL
    const currentUrl = "http://localhost:3000/";

    // Generate a unique UUID token for email verification
    const id = result.insertedId;
    console.log(id);
    const verificationToken = uuidv4() + id;

    // Send the verification email with the EJS template
    const verificationLink = `${currentUrl}api/v1/ped/verify/${id}/${verificationToken}`;

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const emailTemplatePath = path.join(
      __dirname,
      "../Views/emailVerification.ejs"
    );
    const emailTemplateContent = await fs.readFile(emailTemplatePath, "utf8");

    const emailContent = ejs.render(emailTemplateContent, { verificationLink });

    await transporter.sendMail({
      to: userData.email,
      subject: "Email Verification",
      html: emailContent,
    });
    // hash the token before storing it in the database
    const hashedToken = await hashInputData(verificationToken);

    // Create a record in the "userVerifications" collection
    await userVerificationsCollection.insertOne({
      userId: result.insertedId,
      uniqueString: hashedToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Respond with status for pending email verification
    res.status(201).json({
      status: "Pending",
      message: " Verification email sent.",
      user: createdUser,
    });
  } catch (error) {
    console.error("Error making the registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//______________________ verifying user through sent email______________________________/
export const verifyUser = async (req, res) => {
  try {
    const sentUserId = req.params.sentUserId;
    const verificationToken = req.params.token;
    const userVerificationsCollection = getCollection("userVerifications");
    const usersCollection = getCollection("users");

    // Look up the user verification record in the database with the user ID
    const verificationRecord = await userVerificationsCollection.findOne({
      userId: new ObjectId(sentUserId),
    });

    console.log(" ID IS " + sentUserId);
    console.log("record  is " + verificationRecord);
    if (!verificationRecord) {
      return res
        .status(404)
        .json({ error: "Email verified already or Error happened." });
    }

    // Check if the token has expired
    const currentTime = new Date();
    console.log(currentTime);
    if (currentTime > verificationRecord.expiresAt) {
      let message = "link has expired";
      return res.redirect(`/api/v1/ped/verified/error=true&message=${message}`);
    }

    // Retrieve the hashed token from the database
    const storedHashedToken = verificationRecord.uniqueString;

    // Hash the received original token
    const newlyHashedToken = await hashInputData(verificationToken);
    // use bycrypt to compare the hashed token with the stored hashed token
    const tokenNotChanged = bcrypt.compare(newlyHashedToken, storedHashedToken);
    // Compare the freshly hashed token with the stored hashed token
    if (tokenNotChanged === false) {
      let message = "Invalid token";
      return res.redirect(`/api/verified/error=true&message= ${message}`);
    }

    // Mark the user's email as verified in the users collection
    await usersCollection.updateOne(
      { _id: verificationRecord.userId },
      { $set: { emailVerified: true } }
    );

    // Remove the verification token record
    await userVerificationsCollection.deleteOne({
      _id: verificationRecord._id,
    });
    let message = "Email is verified successfully";
    return res.redirect(`/api/v1/ped/verified/error=false&message= ${message}`);
  } catch (error) {
    console.error("Error verifying email:", error);
    let message = "Internal Server Error";
    return res.redirect(`/api/v1/ped/verified/error=true&message=${message}`);
  }
};

//_____________confirm email verification____________________/
export async function userEmailVerified(req, res) {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const emailTemplatePath = path.join(
      __dirname,
      "../Views/confirmVerification.html"
    );

    res.sendFile(emailTemplatePath);
  } catch (error) {
    console.error(
      "Error giving the feedback after  clicking verification link:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//_______________ Login as a user_______________/
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersCollection = getCollection("users");

    // Find the user by email
    const user = await usersCollection.findOne({ email: email });

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
// ___________________Get your own profile_______________________/
export const getUserById = async (req, res) => {
  try {
    const userId = `${req.params.id}`;
    const usersCollection = getCollection("users");

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ObjectId." });
    }

    const authToken = req.headers.authorization;

    let token = null;

    if (authToken && authToken.startsWith("Bearer ")) {
      token = authToken.split(" ")[1];
    }

    if (token) {
      const decodedToken = verifyAuthToken(token);

      if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized. Invalid token." });
      }

      // Ensure that the user is requesting their own profile
      if (decodedToken.input._id !== userId) {
        console.log(decodedToken._id);
        console.log(userId);
        return res
          .status(403)
          .json({ error: "Forbidden. You can only access your own profile." });
      }
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

      Description: "All blogs written by this user",
      method: "get",
      url: `http://localhost:3000/api/v1/ped/blogs/${userId}`,
    });
  } catch (error) {
    console.error("Error occurred while fetching a user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//________________ Search for users by username or email and retrieve their blogs______/
export const searchUsersWithBlogs = async (req, res) => {
  try {
    const query = req.query.q;
    const usersCollection = getCollection("users");
    const blogsCollection = getCollection("blogs");

    // Use a MongoDB query to find users with matching usernames or full names
    const searchResults = await usersCollection
      .find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { fullName: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({ message: "No matching users found." });
    }

    // Retrieve blogs for each user
    const usersWithBlogs = await Promise.all(
      searchResults.map(async (user) => {
        // Find blogs associated with the user based on writter name of such blog
        const userBlogs = await blogsCollection
          .find({ username: user.Writter })
          .toArray();

        return {
          user: {
            _id: user._id,
            username: user.username,
          },
          Count: userBlogs.length,
          blogs: userBlogs,
        };
      })
    );

    // Return the search results with user details and associated blogs
    res.status(200).json({
      message: "Users found matching the search query with their blogs.",
      user: usersWithBlogs,
    });
  } catch (error) {
    console.error("Error searching for users with blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//___________________Update user by ID___________________________/
export const updateUserById = async (req, res) => {
  const id = `${req.params.id}`;
  const userUpdatedData = { ...req.body };

  try {
    const usersCollection = getCollection("users");

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid UserId." });
    }
    const authToken = req.headers.authorization;

    let token = null;

    if (authToken && authToken.startsWith("Bearer ")) {
      token = authToken.split(" ")[1];
    }

    if (token) {
      const decodedToken = verifyAuthToken(token);

      // Ensure that the user is updating their own profile
      if (decodedToken.input._id !== id) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this user." });
      }

      if (userUpdatedData.password) {
        // If the password is being updated, hash it
        userUpdatedData.password = await hashInputData(
          userUpdatedData.password
        );
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
    }
  } catch (error) {
    console.error("Error updating a user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//______________ Delete user by ID or User deleting their own account______________/
export const deleteUserById = async (req, res) => {
  const id = `${req.params.id}`;

  try {
    const usersCollection = getCollection("users");

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid UserId." });
    }

    const authToken = req.headers.authorization;

    let token = null;

    if (authToken && authToken.startsWith("Bearer ")) {
      token = authToken.split(" ")[1];
    }

    if (token) {
      const decodedToken = verifyAuthToken(token);
      if (
        decodedToken.input._id !== id ||
        decodedToken.input.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this user." });
      } else {
        const result = await usersCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "User not found." });
        }

        res.status(204).send();
      }
    }
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
    // update the following person Document with following number
    const result1 = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentUserId) },
      {
        $inc: { followingCount: 1 },
        $push: {
          following: {
            userId: followedUserId,
            username: req.user.username,
            email: req.user.email,
          },
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Blogger not found." });
    } else if (!result1.value) {
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
    // update the following person Document with following number
    const result1 = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentUserId) },
      {
        $inc: { followingCount: -1 },
        $pull: {
          following: { userId: currentUserId },
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res
        .status(404)
        .json({ error: "Blogger not found to be followed." });
    } else if (!result1.value) {
      return res
        .status(404)
        .json({ error: "You can't unfollow the person you are not following" });
    }

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
    const usersCollection = getCollection("users");
    const blogsCollection = getCollection("blogs");
    const reportedCollection = getCollection("reportedContent");

    // Check if the user exists
    const user = await usersCollection.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the blog with the specified ID exists
    const blog = await blogsCollection.findOne({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    // Check if the user's token is valid and not expired
    const tokenIsValid = verifyAuthToken(req.user.token);
    if (!tokenIsValid) {
      return res
        .status(403)
        .json({ error: "Invalid token or token has expired." });
    }

    // Check user authorization if necessary

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
      reportedBlog: result,
    });
  } catch (error) {
    console.error("Error reporting content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
