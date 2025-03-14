// get all products

import Product from "../model/product.model.js";
import slugify from "slugify";
// Add a new product
export const AddProduct = async (req, res) => {
  try {
    const newproduct = new Product({
      ...req.body,
      slug: slugify(req.body.name, { lower: true }),
    });
    await newproduct.save();
    return res.status(201).json({
      message: "Product added successfully",
      product: newproduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// delete product
export const DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//  update product
export const UpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const GetAllProducts = async (req, res) => {
  // pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search || "";

  try {
    const productcount = await Product.countDocuments();
    const totalPages = Math.ceil(productcount / limit);
    const products = await Product.find(
      search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { brand: { $regex: search, $options: "i" } },
            ],
          }
        : category
        ? { category }
        : {}
    )
      .populate("priceByVariant")
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (page > totalPages) {
      return res.status(404).json({ message: "No more products" });
    }

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      nextpage: page + 1,
      prevpage: page - 1,
      totalProducts: productcount,
      nextpageurl: `/api/products?page=${page + 1}&limit=${limit}`,
      prevpageurl: `/api/products?page=${page - 1}&limit=${limit}`,
      allproductsurl: `/api/products`,
      limit,
      skip,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// get product by name, similar to search or filter based on query
export const GetProductByName = async (req, res) => {
  try {
    let filterItem = {};

    if (req.query.name) {
      filterItem.name = { $regex: req.query.name, $options: "i" }; // Case-insensitive partial match
    }

    if (req.query.category) {
      filterItem.category = req.query.category;
    }

    if (req.query.brand) {
      filterItem.brand = { $regex: req.query.brand, $options: "i" };
    }

    if (req.query.price) {
      filterItem.price = req.query.price;
    }

    // Find products with matching filters
    const products = await Product.find(filterItem)
      .populate("priceByVariant")
      .populate("category");

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//  get product by id

export const GetProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("priceByVariant")
      .populate("category", "name image")
      .populate("subcategory", "name image");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
