const { StatusCodes } = require("http-status-codes");
const { spotifyApiBaseUrl } = require("../utils");

const savePlaylist = async (req, res) => {
  const ids = req.body.ids;
  const userId = req.body.userId;
  const playlistDetails = req.body.playlist;
  if (!ids || !ids?.length) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Track ids are required" });
  } else if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "User ID is required" });
  } else if (!playlistDetails || !playlistDetails?.name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Please send Playlist details with name" });
  }
  try {
    // creating user playlist first
    const playlistResponse = await fetch(
      `${spotifyApiBaseUrl}/v1/users/${userId}/playlists`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${req.headers.authorization}`,
        },
        method: "POST",
        body: JSON.stringify(playlistDetails),
      }
    );
    const playlistData = await playlistResponse.json();
    if (!playlistResponse.ok) {
      throw new Error(playlistData.error.message);
    }

    // adding tracking to playlist
    const playlistUpdateResponse = await fetch(
      `${spotifyApiBaseUrl}/v1/playlists/${playlistData.id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${req.headers.authorization}`,
        },
        method: "POST",
        body: JSON.stringify({
          uris: ids,
        }),
      }
    );
    const playlistUpdatedData = await playlistUpdateResponse.json();
    if (!playlistUpdateResponse.ok) {
      throw new Error(playlistUpdatedData.error.message);
    }
    return res.status(StatusCodes.OK).send({
      data: playlistUpdatedData,
      message: "Playlist created successfully",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
  }
};

module.exports = {
  savePlaylist,
};
