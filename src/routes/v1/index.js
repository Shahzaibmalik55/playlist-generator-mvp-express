const express = require("express");

// Middlewares
const Middlewares = require("../../middlewares");

// Controllers
const {
  LoginController,
  PlaylistGeneratorController,
  SavePlaylistController,
  SearchSpotifyController,
  GetArtistsController,
} = require("../../controllers");

const router = express.Router();

router.get("/auth/login", LoginController.login);

router.post(
  "/playlist/generate",
  Middlewares.AuthorizationMiddleware,
  PlaylistGeneratorController.generatePlaylist
);

router.post(
  "/playlist/save",
  Middlewares.AuthorizationMiddleware,
  SavePlaylistController.savePlaylist
);

router.get(
  "/spotify-search",
  Middlewares.AuthorizationMiddleware,
  SearchSpotifyController.search
);

router.get(
  "/artists",
  Middlewares.AuthorizationMiddleware,
  GetArtistsController.getArtists
);

module.exports = router;
