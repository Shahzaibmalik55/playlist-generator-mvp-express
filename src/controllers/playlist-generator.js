const { OpenAI } = require("openai");
const { StatusCodes } = require("http-status-codes");
const {
  spotifyApiBaseUrl,
  encodeQueryData,
  jsonFromString,
} = require("../utils");

const generatePlaylist = async (req, res) => {
  try {
    // getting artists top tracks
    if (req.body.artist) {
      const response = await fetch(
        `${spotifyApiBaseUrl}/v1/artists/${req.body.artist}/top-tracks`,
        {
          headers: {
            Authorization: `Bearer ${req.headers.authorization}`,
          },
        }
      );
      const tracks = await response.json();
      if (!response.ok) {
        throw new Error(tracks.error.message);
      }
      return res.status(StatusCodes.OK).send({ data: tracks });
    }
    // getting tracks from mood
    const mood = req.body.mood;
    const openai = new OpenAI();
    if (!mood) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: "Text is required" });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Suggest a way to generate perfectly search for the tracks using OpenAI api for '/search' API of spotify based on this query '${mood}', 
          please return search params which should be match for the spotify search API,
          only return the year, type (which can be array of string), q, limit should be 20 AND genre, kept the genre format exactly like required in /search API of spotify, 
          the q (query parameter) should perfectly represent the mood and format for Spotify '/search' API,
          with help of those parameters I can fetch the exact tracks for playlist, please just return the json for parameters, 
          don't add any text in the results`,
        },
      ],
      max_tokens: 200,
    });
    const content = completion.choices[0].message.content;
    const json = jsonFromString(content);
    const query = encodeQueryData({ ...json });
    const response = await fetch(`${spotifyApiBaseUrl}/v1/search?${query}`, {
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
      },
    });
    const recommendations = await response.json();
    if (!response.ok) {
      throw new Error(recommendations.error.message);
    }
    return res.status(StatusCodes.OK).send({ data: recommendations });
  } catch (err) {
    console.log("err", err);
    return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message });
  }
};

module.exports = {
  generatePlaylist,
};
