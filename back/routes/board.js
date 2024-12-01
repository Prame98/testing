const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { checkAuthMiddleware } = require("../util/auth");

const router = express.Router();

const { getMyBoards } = require("../controllers/board.js");

router.get("/myBoard", checkAuthMiddleware, getMyBoards);
router.get("/like");

module.exports = router;
