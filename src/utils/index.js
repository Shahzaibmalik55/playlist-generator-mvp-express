const accountsSpotifyBaseUrl = "https://accounts.spotify.com";
const spotifyApiBaseUrl = "https://api.spotify.com";

const encodeQueryData = (data) => {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
};

function jsonFromString(str) {
  const regex = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
  const matches = str.match(regex);
  return Object.assign({}, ...matches.map((m) => JSON.parse(m)));
}

module.exports = {
  accountsSpotifyBaseUrl,
  spotifyApiBaseUrl,
  encodeQueryData,
  jsonFromString,
};
