// category controller

import Category from "../model/category.model.js";

import extractPublicId from "../lib/extractPublicid.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "daq7v0wmf",
  api_key: "286238383573198",
  api_secret: "F25Rkv7b6fVQSgU0LXXzQe5KAe8",
});
//  post a category

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { imageUrl } = req.files;

    if (!name || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(
      imageUrl.tempFilePath,
      {
        folder: "categories",
      }
    );

    if (!uploadResponse) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const category = new Category({
      name,
      image: uploadResponse.secure_url,
    });

    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//  get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("subcategory")
      .populate({
        path: "product",
        populate: {
          path: "priceByVariant",
        },
      });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//  get a category by id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate("subcategory")
      .populate("product");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//  update a category
export const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server Error" });
  }
};

//  delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Delete the image from Cloudinary if it exists
    const publicId = extractPublicId(category.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
