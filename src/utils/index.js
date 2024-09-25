const accountsSpotifyBaseUrl = "https://accounts.spotify.com";
const spotifyApiBaseUrl = "https://api.spotify.com";

const encodeQueryData = (data) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

module.exports = {
  accountsSpotifyBaseUrl,
  spotifyApiBaseUrl,
  encodeQueryData,
};
