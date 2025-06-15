import express from "express";
import { shorten, getShorten, analyzeShorten, getAllCode } from "../controllers/urlControls.js";
const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).send({ message: "Welcome to the URL Shortener API!" });
});

router.post('/shorten', shorten);
router.get('/:code', getShorten);
router.get('/url/allcode', getAllCode);
router.get('/analytics/:code', analyzeShorten);


export default router;
