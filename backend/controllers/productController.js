import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    const products = await Product.find();

    res.status(200).json(products);
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    // another way : const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    res.status(200).json(product);
};

export const createProduct = async (req, res) => {
    const { name, description, price, image, category, stock, rating } = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        image,
        category,
        stock,
        rating,
    });

    res.status(201).json(product);
};



export const updateProduct = async (req, res) => {
    const { name, description, price, image, category, stock, rating } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.rating = rating ?? product.rating;

    await product.save();

    return res.status(200).json(product);
};


export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
     if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }
    await product.deleteOne();
    return res.status(200).json(
       {
            message: "Product deleted Successfully",
        }

    );
    //or await Product.findByIdAndDelete(id);
};
