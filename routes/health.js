const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ status: "OK", message: "API is healthy"});
});

module.exports = router;