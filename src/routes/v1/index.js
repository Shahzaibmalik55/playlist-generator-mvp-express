const express = require("express");

const { LoginController } = require("../../controllers");

const router = express.Router();

router.get("/auth/login", LoginController.login);

module.exports = router;
