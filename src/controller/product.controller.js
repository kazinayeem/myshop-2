// get all products

import { productSchema } from "../lib/ProductValidation.js";
import Category from "../model/category.model.js";
import Product, { Variant } from "../model/product.model.js";

// Add a new product
export const AddProduct = async (req, res) => {
  try {
    const parsedData = productSchema.safeParse({
      ...req.body,
      price: Number(req.body.price),
      discountedPrice: Number(req.body.discountedPrice) || 0,
      discountPercent: Number(req.body.discountPercent) || 0,
      stock: Number(req.body.stock),
      numReviews: Number(req.body.numReviews) || 0,
      rating: Number(req.body.rating) || 0,
      returnableDays: Number(req.body.returnableDays) || 0,
      isFeatured: req.body.isFeatured === "true",
      cod: req.body.cod === "true",
      returnable: req.body.returnable === "true",
      image: req.body.image ? req.body.image : [],
      variants: req.body.variants ? req.body.variants : [],
    });

    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.format() });
    }

    const {
      name,
      description,
      section,
      buyingPrice,
      price,
      discountedPrice,
      discountPercent,
      image,
      video,
      category,
      subcategory,
      stock,
      brand,
      rating,
      numReviews,
      isFeatured,
      slug,
      warranty,
      returnable,
      returnableDays,
      cod,
      variants,
    } = parsedData.data;

    // Create new product
    const newProduct = new Product({
      name,
      description,
      section,
      buyingPrice,
      price,
      discountedPrice,
      discountPercent,
      priceByVariant: [],
      image,
      video,
      category,
      subcategory,
      stock,
      brand,
      rating,
      numReviews,
      isFeatured,
      slug,
      warranty,
      returnable,
      returnableDays,
      cod,
    });

    // Save the product first
    const savedProduct = await newProduct.save();

    // Handle Variants
    let variantIds = [];
    if (variants.length > 0) {
      for (const variant of variants) {
        const newVariant = new Variant({
          product: savedProduct._id,
          name: variant.name,
          value: variant.value,
          price: variant.price,
          stock: variant.stock,
          image: variant.image,
        });

        const savedVariant = await newVariant.save();
        variantIds.push(savedVariant._id);
      }
    }

    // Update product with variant IDs
    savedProduct.priceByVariant = variantIds;
    await savedProduct.save();

    await Category.findByIdAndUpdate(category, {
      $push: { product: savedProduct._id },
    });

    return res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
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
  try {
    const productcount = await Product.countDocuments();
    const totalPages = Math.ceil(productcount / limit);
    const products = await Product.find()
      .populate("priceByVariant")
      .populate("category" , "name")
      .skip(skip)
      .limit(limit);

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
      .populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
