const { StatusCodes } = require("http-status-codes");
const { spotifyApiBaseUrl } = require("../utils");

const getArtists = async (req, res) => {
  try {
    const apiResponse = await fetch(`${spotifyApiBaseUrl}/v1/me/top/artists`, {
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
      },
    });
    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      throw new Error(data.error.message);
    }
    return res.status(StatusCodes.OK).send({ data });
  } catch (err) {
    console.log("err", err);
    return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
  }
};

module.exports = {
  getArtists,
};
