import { getCollection } from "../database.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

// Create a new blog or any content type.
export const createBlog = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");
    const blogData = req.body;
    const file = req.file;
    if (file) {
      console.log("Uploaded file:", file);
      blogData.image = file.path;

    }

    const result = await blogsCollection.insertOne(blogData);

    const createdBlog = {
      _id: result.insertedId,
      title: result.title,
      content: result.content,
      image: result.image,
    };

    res.status(201).json({
      message: "Content created successfully.",
      blog: createdBlog,
      request: {
        type: "GET",
        description: "Get the created blogpost/any type",
        url: `/api/v1/ped/blogs/${result.insertedId}`,
      },
    });
  } catch (error) {
    console.error("Error creating the content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all blogs/any content type.
export const getAllBlogs = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");
    const blogs = await blogsCollection.find({}).toArray();

    res.status(200).json({
      metadata: {
        count: blogs.length,
        message: "List of all created blogs retrieved successfully.",
      },
      blogs: blogs,
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
    if (!id) {
      return res
        .status(400)
        .json({ error: "be specific about the blog you want to retrieve" });
    }
    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne(new ObjectId(id));
    if (!blog) {
      return res
        .status(404)
        .json({ error: "The blog that you are looking is not available" });
    }
    const formattedBlog = {
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      ...blog,
    };

    res.status(200).json({
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "You can still see all blogs",
        url: `/api/v1/ped/blogs`,
      },
    });
  } catch (error) {
    console.error("Error fetching a blogpost:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Update an existing blog
export const updateBlog = async (req, res) => {
  const id = `${req.params.id}`;
  const blogUpdatedData = {};
  const file = req.file; 
  try {
    const blogsCollection = getCollection("blogs");

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Invalid ObjectId. You can't update content then." });
    }

    if (typeof blogUpdatedData !== "object" || blogUpdatedData === null) {
      return res.status(400).json({ error: "Invalid update data" });
    }

    if (file) {      
      const uploadDir = "./blogImages/";
      const originalName = file.originalname;
      const timestamp = Date.now();
      const filename = `${timestamp}_${originalName}`;

       const filePath = uploadDir + filename;      
      fs.renameSync(file.path, filePath);
      blogUpdatedData.image = filePath;
    }

    for (const key in req.body) {
      blogUpdatedData[key] = req.body[key];
    }

    const updatedBlog = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: blogUpdatedData },
      { returnDocument: "after" }
    );

    if (updatedBlog === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, content didn't get updated." });
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
        description: "Get the content of updated blog",
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
  const id = `${req.params.id}`;

  try {
    const blogsCollection = getCollection("blogs");
    console.log(id);
    const result = await req.blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Blog not found,can't perform delete" });
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
