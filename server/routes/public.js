const express = require("express");
const User = require("../models/User");
const Trip = require("../models/Trip");
const Profile = require("../models/Profile");

const router = express.Router();

router.get("/:username/trips/:tripId", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) return res.status(404).json({ message: "Profile not found" });
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: user._id,
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error("Public trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) return res.status(404).json({ message: "Profile not found" });

    const [trips, profile] = await Promise.all([
      Trip.find({ userId: user._id }).sort({ createdAt: -1 }),
      Profile.findOne({ userId: user._id }),
    ]);

    res.json({
      user: { id: user._id, name: user.name, username: user.username },
      trips,
      profile: profile || { bio: "", quote: "", gear: [], interests: [] },
    });
  } catch (err) {
    console.error("Public profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
