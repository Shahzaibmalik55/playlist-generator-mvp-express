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
          content: `Create a ${mood} playlist, please return only list of of seed OR genres with comma separated, please make sure to seed/genres which are map to spotify also list should be lowercase and only one word, limit to 5`,
        },
      ],
      max_tokens: 50,
    });
    const seedGenres = completion.choices[0].message.content;
    const query = encodeQueryData({
      seed_genres: seedGenres,
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
