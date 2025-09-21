const {register, update, deleteUser, verifyUser} = require("../controller/user");
const uploads = require("../middleware/multer");

const router = require("express").Router(); 
router.post("/register",uploads.single("profilePicture"), register);
router.put("/update/:id", uploads.single("profilePicture"), update);
router.delete("/delete/:id", uploads.single("profilePicture"), deleteUser);
router.get("/verify/:id", verifyUser);




module.exports = router;
