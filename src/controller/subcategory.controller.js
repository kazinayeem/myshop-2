import Category from "../model/category.model.js";
import SubCategory from "../model/subcategory.model.js";
// create subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, image, categoryid } = req.body;
    const subcategory = new SubCategory({ category: categoryid, image, name });
    await subcategory.save();
    // push category
    await Category.findByIdAndUpdate(
      categoryid,
      { $push: { subcategories: subcategory._id } },
      { new: true }
    );
    return res.status(201).json(subcategory);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get all subcategories
export const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find()
      .populate("category")
      .populate();
    return res.status(200).json(subcategories);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get a subcategory by id
export const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate(
      "category"
    );
    if (!subcategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    return res.status(200).json(subcategory);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
// update a subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const { name, image, categoryid } = req.body;
    const subcategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, image, category: categoryid },
      { new: true }
    );
    if (!subcategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    return res.status(200).json(subcategory);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// delete a subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    // remove subcategory from category
    await Category.findByIdAndUpdate(
      subcategory.category,
      { $pull: { subcategories: req.params.id } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
