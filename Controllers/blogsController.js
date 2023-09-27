import { getCollection } from "../database.js";
import { ObjectId } from "mongodb";
// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");
    const blogData = req.body;
    const file = req.file;
    if (file) {
      blogData.image = file.path;
    }

    const result = await blogsCollection.insertOne(blogData);

    const createdBlog = {
      _id: result.insertedId,
      title: blogData.title,
      content: blogData.content,
      image: blogData.image,
    };

    res.status(201).json({
      message: "Content created successfully.",
      blog: createdBlog,
      request: {
        type: "GET",
        description: "Get the created blogpost",
        url: `/api/v1/ped/blogs/${result.insertedId}`,
      },
    });
  } catch (error) {
    console.error("Error adding a blogpost:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");
    const blogs = await blogsCollection.find({}).toArray();

    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      hasImage: blog.image,
    }));

    res.status(200).json({
      metadata: {
        count: blogs.length,
        message: "List of all created blogs retrieved successfully.",
      },
      blogs: formattedBlogs,
      request: {
        type: "GET",
        description: "Get all blogs",
        url: "/api/v1/ped/blogs",
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const id = `${req.params.id}`;
    console.log(id);
    if (!id) {
      return res.status(400).json({ error: "_id parameter is required" });
    }
    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne(new ObjectId(id));
    console.log(id);
    if (!blog) {
      console.log(id);
      return res.status(404).json({ error: "Blog not found" });
    }
    const formattedBlog = {
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
    };

    res.status(200).json({
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the blog",
        url: `/api/v1/ped/blogs/${id}`,
      },
    });
  } catch (error) {
    console.error("Error fetching a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing blog
export const updateBlog = async (req, res) => {
  const id = `${req.params.id}`;
  const blogData = req.body;
  const file = req.file;

  if (file) {
    blogData.image = file.path;
  }

  try {
    const blogsCollection = getCollection("blogs");

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    // Ensure blogData is an object
    if (typeof blogData !== "object" || blogData === null) {
      return res.status(400).json({ error: "Invalid update data" });
    }

    const updateQuery = { $set: {} };

    for (const key in blogData) {
      // Only update fields that exist in the blogData object
      if (blogData.hasOwnProperty(key)) {
        updateQuery.$set[key] = blogData[key];
      }
    }

    const updatedBlog = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateQuery,
      { returnDocument: "after" }
    );

    if (updatedBlog === null) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const formattedBlog = {
      _id: updatedBlog._id,
      ...updatedBlog,
    };

    res.status(200).json({
      message: "Blog updated successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the updated blog",
        url: `/api/v1/ped/blogs/${id}`,
      },
    });
  } catch (error) {
    console.error("Error updating a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a blog by ID
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blogsCollection = getCollection("blogs");
    const result = await blogsCollection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog deleted successfully.",
      request: {
        type: "POST",
        description: "Create a new blog",
        url: "/api/v1/ped/blogs",
        body: {
          title: "string",
          content: "string",
          image: "base64",
        },
      },
    });
  } catch (error) {
    console.error("Error deleting a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
