import express from "express";
import { initializeDatabase, transactionAll, getStatistics, barChart, combinedData, pieChart } from "../controllers/transactionController.js";

const router = express.Router();


router.get('/initialize', initializeDatabase);
router.get('/transactionall', transactionAll);
router.get('/statistics', getStatistics);
router.get('/barchart', barChart);
router.get('/piechart', pieChart);
router.get('/combined', combinedData);



export default router;