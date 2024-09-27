const { OpenAI } = require("openai");
const { StatusCodes } = require("http-status-codes");
const { spotifyApiBaseUrl, encodeQueryData } = require("../utils");

const generatePlaylist = async (req, res) => {
  const mood = req.body.mood;
  const openai = new OpenAI();
  if (!mood) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Text is required" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Suggest a way to generate perfectly create a playlists using OpenAI api and Spotify api based on mood and situations - for example - ${mood}, please return ONLY list of genres as an comma separated values, please make sure to seed/genres which are map to spotify also list should be lowercase and only one word, limiting to 5`,
        },
      ],
      max_tokens: 50,
    });
    const aiResponse = completion.choices[0].message.content;
    const query = encodeQueryData({
      seed_genres: aiResponse,
    });
    const response = await fetch(
      `${spotifyApiBaseUrl}/v1/recommendations?${query}`,
      {
        headers: {
          Authorization: `Bearer ${req.headers.authorization}`,
        },
      }
    );
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
