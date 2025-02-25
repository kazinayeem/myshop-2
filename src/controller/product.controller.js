// get all products

import Product from "../model/product.model.js";

export const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("priceByVariant");
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//  get product by id

export const GetProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "priceByVariant"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
