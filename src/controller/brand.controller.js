// brand coltroller

import Brand from "../model/brand.model.js";
import cloudinary from "cloudinary";
import { envData } from "../config/envdata.js";
import extractPublicId from "../lib/extractPublicid.js";

cloudinary.config({
  cloud_name: envData.cloud_name,
  api_key: envData.api_key,
  api_secret: envData.api_secret,
});
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
  try {
    const { name, description } = req.body;

    // Check if a logo image was uploaded
    if (!req.files || !req.files.logo) {
      return res.status(400).json({ message: "Logo image is required" });
    }

    const logoFile = req.files.logo;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(
      logoFile.tempFilePath || logoFile.data,
      {
        folder: "brands",
        resource_type: "image",
      }
    );

    const newBrand = new Brand({
      name,
      description,
      logo: uploadResult.secure_url,
    });

    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const publicId = extractPublicId(deletedBrand.logo);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
