const express = require('express');
const { getProducts, newProduct, getSingleProducts, uppdateProducts, deleteProducts } = require('../controllers/productControllers');
const router = express.Router();
const {isAuthenticatedUser,isautherizeRoles} = require("../middlewares/authenticate");


router.route("/product").get(isAuthenticatedUser,getProducts);


router.route("/product/new").post(isAuthenticatedUser,isautherizeRoles('super admin'),newProduct);
router.route("/product/:id")
                            .get(isAuthenticatedUser,isautherizeRoles('super admin'),getSingleProducts)
                            .put(isAuthenticatedUser,isautherizeRoles('super admin'),uppdateProducts)
                            .delete(isAuthenticatedUser,isautherizeRoles('super admin'),deleteProducts);

module.exports = router;