// add slider

import Slider from "../model/slider.model.js";

export const addSlider = async (req, res) => {
  const { title, description, image, buttonText, buttonLink, status } =
    req.body;
  try {
    const slider = await Slider.create({
      title,
      description,
      image,
      buttonText,
      buttonLink,
      status,
    });
    return res.status(201).json(slider);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get all slider
export const getAllSlider = async (req, res) => {
  try {
    const slider = await Slider.find();
    return res.status(200).json(slider);
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
    await Slider.findByIdAndDelete(id);
    return res.status(200).json({ message: "Slider deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};