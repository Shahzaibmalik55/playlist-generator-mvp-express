const express = require("express");

// Middlewares
const Middlewares = require("../../middlewares");

// Controllers
const {
  LoginController,
  PlaylistGeneratorController,
} = require("../../controllers");

const router = express.Router();

router.get("/auth/login", LoginController.login);

router.post(
  "/playlist/generate",
  Middlewares.AuthorizationMiddleware,
  PlaylistGeneratorController.generatePlaylist
);

module.exports = router;
