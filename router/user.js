const {register, update, deleteUser} = require("../controller/user");
const uploads = require("../middleware/multer");

const router = require("express").Router(); 
router.post("/register",uploads.single("profilePicture"), register);
router.put("/update/:id", uploads.single("profilePicture"), update);
router.delete("/delete/:id", uploads.single("profilePicture"), deleteUser);




module.exports = router;
