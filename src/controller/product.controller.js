// get all products
import mongoose from "mongoose";
import slugify from "slugify";
import Category from "../model/category.model.js";
import Product from "../model/product.model.js";
import SubCategory from "../model/subcategory.model.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import extractPublicId from "../lib/extractPublicid.js";

cloudinary.config({
  cloud_name: "daq7v0wmf",
  api_key: "286238383573198",
  api_secret: "F25Rkv7b6fVQSgU0LXXzQe5KAe8",
});
// Add a new product
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const AddProduct = async (req, res) => {
  if (typeof req.body.priceByVariant === "string") {
    req.body.priceByVariant = JSON.parse(req.body.priceByVariant);
  }
  try {
    const categoryid = req.body.category;
    const subcategoryid = req.body.subcategory;
    const imageUrl = [];
    // // Normalize to array
    const images = Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image];
    const variantImages = req.files?.variantImages
      ? Array.isArray(req.files.variantImages)
        ? req.files.variantImages
        : [req.files.variantImages]
      : [];

    // for (const image of images) {
    //   const timestamp = Date.now();
    //   const safeName = image.name.replace(/\s+/g, "_");
    //   const newName = `${timestamp}_${safeName}`;
    //   // const uploadPath = path.join(__dirname, newName);
    //   const uploadPath = path.join(__dirname, "../../uploads", newName);
    //   await image.mv(uploadPath);
    //   imageUrl.push(`/uploads/${newName}`);
    // }
    // const baseUrl = `${req.protocol}://${req.get("host")}`;
    for (const image of images) {
      const result = await cloudinary.v2.uploader.upload(
        image.tempFilePath || image.tempFilePath,
        {
          folder: "ecommerce",
        }
      );
      imageUrl.push(result.secure_url);
    }
    for (let i = 0; i < req.body.priceByVariant.length; i++) {
      const variant = req.body.priceByVariant[i];
      const imageFile = variantImages[i];

      if (imageFile) {
        const result = await cloudinary.v2.uploader.upload(
          imageFile.tempFilePath || imageFile.tempFilePath,
          {
            folder: "ecommerce/variants",
          }
        );

        variant.image = result.secure_url;
      } else {
        variant.image = "";
      }
    }

    const newproduct = new Product({
      ...req.body,
      image: imageUrl,
      slug: slugify(req.body.name + Math.random() * 323232, { lower: true }),
    });
    await newproduct.save();
    await Category.findByIdAndUpdate(
      categoryid,
      { $push: { product: newproduct._id } },
      { new: true }
    );
    await SubCategory.findByIdAndUpdate(
      subcategoryid,
      { $push: { product: newproduct._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Product added successfully",
      product: newproduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Helper function to extract public_id from secure_url

// delete product
export const DeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image && product.image.length > 0) {
      for (const img of product.image) {
        if (img) {
          const publicId = extractPublicId(img);
          await cloudinary.v2.uploader.destroy(publicId);
        }
      }
    }

    // Delete variant images from Cloudinary
    if (product.priceByVariant && product.priceByVariant.length > 0) {
      for (const variant of product.priceByVariant) {
        if (variant.image) {
          const publicId = extractPublicId(variant.image);
          await cloudinary.v2.uploader.destroy(publicId);
        }
      }
    }
    // Remove product from category and subcategory
    await Category.findByIdAndUpdate(product.category, {
      $pull: { product: id },
    });
    await SubCategory.findByIdAndUpdate(product.subcategory, {
      $pull: { product: id },
    });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, subcategory } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name && name !== existingProduct.name) {
      req.body.slug = slugify(name, { lower: true });
    }

    const categoryChanged =
      category && category !== existingProduct.category.toString();
    const subcategoryChanged =
      subcategory && subcategory !== existingProduct.subcategory.toString();

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (categoryChanged) {
      await Category.findByIdAndUpdate(existingProduct.category, {
        $pull: { product: id },
      });
      await Category.findByIdAndUpdate(category, { $push: { product: id } });
    }

    if (subcategoryChanged) {
      await SubCategory.findByIdAndUpdate(existingProduct.subcategory, {
        $pull: { product: id },
      });
      await SubCategory.findByIdAndUpdate(subcategory, {
        $push: { product: id },
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const GetAllProducts = async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const subcategory = req.query.subcategory;
  const search = req.query.search || "";

  try {
    const query = {};

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: search });
      }
    }

    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }

    const productcount = await Product.countDocuments(query);
    const totalPages = Math.ceil(productcount / limit);

    const products = await Product.find(query)
      .populate("priceByVariant")
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (page > totalPages) {
      return res.status(200).json({ message: "No more products" });
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

// export const GetAllProducts = async (req, res) => {
//   // pagination
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 30;
//   const skip = (page - 1) * limit;
//   const category = req.query.category;
//   const search = req.query.search || "";

//   try {
//     const productcount = await Product.countDocuments();
//     const totalPages = Math.ceil(productcount / limit);
//     const products = await Product.find(
//       search
//         ? {
//             $or: [
//               { name: { $regex: search, $options: "i" } },
//               { brand: { $regex: search, $options: "i" } },
//             ],
//           }
//         : category
//         ? { category }
//         : {}
//     )
//       .populate("priceByVariant")
//       .populate("category", "name")
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     if (page > totalPages) {
//       return res.status(404).json({ message: "No more products" });
//     }

//     return res.status(200).json({
//       products,
//       currentPage: page,
//       totalPages,
//       nextpage: page + 1,
//       prevpage: page - 1,
//       totalProducts: productcount,
//       nextpageurl: `/api/products?page=${page + 1}&limit=${limit}`,
//       prevpageurl: `/api/products?page=${page - 1}&limit=${limit}`,
//       allproductsurl: `/api/products`,
//       limit,
//       skip,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

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
