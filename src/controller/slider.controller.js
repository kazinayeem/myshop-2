// add slider

import Slider from "../model/slider.model.js";
import cloudinary from "cloudinary";
import { envData } from "../config/envdata.js";
import extractPublicId from "../lib/extractPublicid.js";

cloudinary.config({
  cloud_name: envData.cloud_name,
  api_key: envData.api_key,
  api_secret: envData.api_secret,
});

export const addSlider = async (req, res) => {
  const { title, description, buttonText, buttonLink, status } = req.body;
  const image = req.files.image;
  try {
    // Check if an image was uploaded
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    // Upload to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(
      image.tempFilePath || image.data,
      {
        folder: "slider",
        resource_type: "image",
      }
    );
    const newSlider = new Slider({
      title,
      description,
      image: uploadResult.secure_url,
      buttonText,
      buttonLink,
      status,
    });
    await newSlider.save();
    return res.status(201).json(newSlider);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get all slider
export const getAllSlider = async (req, res) => {
  const { show } = req.query;
  try {
    if (show === "all") {
      const sliders = await Slider.find();
      return res.status(200).json(sliders);
    }
    const sliders = await Slider.find({ status: "active" });
    return res.status(200).json(sliders);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get single slider
export const getSingleSlider = async (req, res) => {
  const { id } = req.params;
  try {
    const slider = await Slider.findById(id);
    return res.status(200).json(slider);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// update slider
export const updateSlider = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, buttonText, buttonLink, status } =
    req.body;
  try {
    const slider = await Slider.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        buttonText,
        buttonLink,
        status,
      },
      { new: true }
    );
    return res.status(200).json(slider);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// delete slider
export const deleteSlider = async (req, res) => {
  const { id } = req.params;
  try {
    const slider = await Slider.findByIdAndDelete(id);
    const imageurl = extractPublicId(slider.image);
    if (imageurl) {
      await cloudinary.uploader.destroy(imageurl, { resource_type: "image" });
    }
    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }
    return res.status(200).json({ message: "Slider deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
