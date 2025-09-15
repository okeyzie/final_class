const {register, getOne} = require("../controller/user");
const uploads = require("../middleware/multer");

const router = require("express").Router(); 
router.post("/register",uploads.single("profilePicture"), register);

router.get("/get/:id", getOne);


module.exports = router;
