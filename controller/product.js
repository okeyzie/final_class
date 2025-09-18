const productModel = require('../models/product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs')

exports.createProduct = async (req, res) => {
  try {
    const { productName } = req.body;
    const files = req.files;
    let response;
    let list = [];
    let babyList = {}

    if (file && files.length > 0) {
      for (const file of files) {
        response = await cloudinary.uploader.upload(file.path)
        babyList = {
          publicId: response.public_id,
          imageUrl: response.secure_url
        }
        list.push(babyList)
        fs.unlinkSync(file.path)
      }
    }

    const products = new productModel({
      productName,
      productImages: list
    });

    await products.save();
    res.status(201).json({
      message: `Product created successfully`,
      data: products
    })

  } catch (error) {
    res.status(500).json({
      message: 'Inernal Server Error',
      error: error.message
    })
  }
}


exports.updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const {productName} = req.body;
    const files = req.files
    const products = await productModel.findById(id);
    let response;
    let list = [];
    let babyList = {};

    if (!products) {
      return res.status(404).json({
        message: `Product not found`
      })
    }

    if (files && files.length > 0) {
      for (const product of products.productImages) {
        await cloudinary.uploader.destroy(product.publicId)
      };
      for (const file of files) {
        response = await cloudinary.uploader.upload(file.path);
        babyList = {
          imageUrl: response.secure_url,
          publicId: response.public_id
        };
        list.push(babyList)
        fs.unlinkSync(file.path);
      }
    }

    const data = {
      productName: productName ?? product.productName,
      productImages: list
    };

    const update = await productModel.findByIdAndUpdate()

  } catch (error) {
    res.status(500).json({
      message: `Internal Server Error`,
      error: error.message
    })
}
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const file = req.file;
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
         if (file && file.path) {
        await cloudinary.uploader.destroy(product.publicId)
        fs.unlinkSync(product.productPicture.publicId)  
      }
        res.status(200).json({
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'internal server error' + error.message,
            error: error.message
        });
    }
}