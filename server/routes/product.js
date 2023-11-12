
import express from "express"
const router = express();

import {barChart, getAllProducts, getProductByMonth, initializeDB}  from "../controllers/product.js"

router.get("/initialize", initializeDB);
router.get("/getAll", getAllProducts);
router.get("/statistics/:month", getProductByMonth);
router.get("/getChart/:month", barChart);

export default router;