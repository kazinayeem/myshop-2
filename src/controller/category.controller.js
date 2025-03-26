// category controller

import Category from "../model/category.model.js";

//  post a category

export const createCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const category = new Category({
      name: name,
      image: imageUrl,
    });
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
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
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
