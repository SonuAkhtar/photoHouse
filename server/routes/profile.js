const express = require("express");
const Profile = require("../models/Profile");
const protect = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const LIMITS = {
  bio: 2000,
  quote: 300,
  gearItem: 100,
  gearCount: 30,
  interestTitle: 120,
  interestBody: 1000,
  interestCount: 20,
};

// GET /api/profile
router.get("/", async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      profile = await Profile.create({ userId: req.userId });
    }
    res.json(profile);
  } catch (err) {
    console.error("GET profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile
router.put("/", async (req, res) => {
  try {
    const { bio, quote, gear, interests } = req.body;

    const update = {};

    if (bio !== undefined) {
      if (typeof bio !== "string")
        return res.status(400).json({ message: "bio must be a string" });
      update.bio = bio.trim().slice(0, LIMITS.bio);
    }

    if (quote !== undefined) {
      if (typeof quote !== "string")
        return res.status(400).json({ message: "quote must be a string" });
      update.quote = quote.trim().slice(0, LIMITS.quote);
    }

    if (gear !== undefined) {
      if (!Array.isArray(gear))
        return res.status(400).json({ message: "gear must be an array" });
      update.gear = gear
        .filter((g) => typeof g === "string")
        .map((g) => g.trim().slice(0, LIMITS.gearItem))
        .filter(Boolean)
        .slice(0, LIMITS.gearCount);
    }

    if (interests !== undefined) {
      if (!Array.isArray(interests))
        return res.status(400).json({ message: "interests must be an array" });
      update.interests = interests
        .slice(0, LIMITS.interestCount)
        .map((it) => ({
          title: (typeof it.title === "string" ? it.title : "")
            .trim()
            .slice(0, LIMITS.interestTitle),
          body: (typeof it.body === "string" ? it.body : "")
            .trim()
            .slice(0, LIMITS.interestBody),
        }))
        .filter((it) => it.title);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true },
    );

    res.json(profile);
  } catch (err) {
    console.error("PUT profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
