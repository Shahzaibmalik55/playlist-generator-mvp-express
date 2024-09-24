const { StatusCodes } = require("http-status-codes");
const { ServerConfig } = require("../config");
const { accountsSpotifyBaseUrl, encodeQueryData } = require("../utils");

const login = async (req, res) => {
  if (!ServerConfig.SPOTIFY_CLIENT_ID) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Spotify Client ID not found" });
  }
  const redirect_uri = ServerConfig.CLIENT_APP_URL_CALLBACK_URL;
  const codeState = new Date().getTime().toString();
  const scope = "user-read-private user-read-email";
  var code = req.query.code || null;
  var state = req.query.state || null;

  // When state is not available
  if (code && state === null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "State not found" });
  }
  // When login from code and state
  else if (code && state) {
    const formData = new URLSearchParams();
    formData.append("code", code);
    formData.append("redirect_uri", redirect_uri);
    formData.append("grant_type", "authorization_code");
    try {
      const response = await fetch(`${accountsSpotifyBaseUrl}/api/token`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(
              ServerConfig.SPOTIFY_CLIENT_ID +
                ":" +
                ServerConfig.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return res.status(StatusCodes.OK).send({ data });
    } catch (err) {
      console.log("err", err);
      return res.status(StatusCodes.BAD_REQUEST).send({ err });
    }
  }
  // When login to get code of spotify
  const query = encodeQueryData({
    response_type: "code",
    client_id: ServerConfig.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: redirect_uri,
    state: codeState,
  });
  const redirectUrl = `${accountsSpotifyBaseUrl}/authorize?${query}`;
  return res.status(StatusCodes.OK).send({
    data: {
      redirectUrl,
    },
  });
};
module.exports = {
  login,
};
