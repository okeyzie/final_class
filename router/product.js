const {createProduct, updateProduct, deleteProduct} = require ("../controller/product.js");
const uploads = require("../middleware/multer");

const router = require("express").Router();

router.post("/create-product", uploads.single("productPicture"),createProduct );
router.put("/update-product/:id", uploads.single("productPicture"), updateProduct );
router.delete("/delete-product/:id", uploads.single("productPicture"), deleteProduct);




module.exports = router;
