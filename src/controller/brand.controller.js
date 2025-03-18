// brand coltroller

import Brand from "../model/brand.model.js";

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new brand
export const createBrand = async (req, res) => {
  const { name, description, logo } = req.body;

  const newBrand = new Brand({
    name,
    description,
    logo,
  });

  try {
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update brand
export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, description, logo } = req.body;

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description, logo },
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete brand
export const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
