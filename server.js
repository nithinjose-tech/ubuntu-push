const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ShortUrl = require("./models/shortUrl");
const app = express();

mongoose
  .connect(
    "mongodb+srv://nithin:nithin@cluster0.b3mnc.mongodb.net/url?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to moongoose");
  })
  .catch((error) => console.log(`${error},could not connect`));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  ShortUrl.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

app.post("/shortUrls", async (req, res) => {
  const fullUrl = req.body.newUrl;
  await ShortUrl.create({ full: fullUrl });

  // res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

const PORT = process.env.PORT | 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
