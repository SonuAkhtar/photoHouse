const express = require("express");
const path = require("path");
const fs = require("fs");
const Trip = require("../models/Trip");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

const FIELD_LIMITS = { place: 100, region: 100, dates: 80, summary: 2000 };
const MAX_CAPTION_LEN = 300;
const MAX_PHOTOS = 20;
const MAX_TAGS = 5;
const MAX_TAG_LEN = 40;

router.use(protect);

function cleanupFiles(files) {
  (files || []).forEach((f) => {
    const fp = path.join(__dirname, "../uploads", f.filename);
    try {
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    } catch (_) {}
  });
}

function parseTags(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return (Array.isArray(parsed) ? parsed : [])
      .filter((t) => typeof t === "string")
      .map((t) => t.trim().slice(0, MAX_TAG_LEN).toLowerCase())
      .filter(Boolean)
      .slice(0, MAX_TAGS);
  } catch {
    return [];
  }
}

router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(trips);
  } catch (err) {
    console.error("GET trips error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error("GET trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", upload.array("photos", MAX_PHOTOS), async (req, res) => {
  try {
    const { place, region, dates, summary, accent } = req.body;

    if (!place || !region || !dates || !summary) {
      cleanupFiles(req.files);
      return res
        .status(400)
        .json({ message: "place, region, dates, and summary are required" });
    }

    for (const [field, max] of Object.entries(FIELD_LIMITS)) {
      if (typeof req.body[field] === "string" && req.body[field].length > max) {
        cleanupFiles(req.files);
        return res
          .status(400)
          .json({ message: `${field} must be ${max} characters or fewer` });
      }
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one photo is required" });
    }

    let captions = [];
    if (req.body.captions) {
      try {
        const parsed = JSON.parse(req.body.captions);
        captions = Array.isArray(parsed) ? parsed : [];
      } catch {
        captions = Array.isArray(req.body.captions)
          ? req.body.captions
          : [req.body.captions];
      }
    }
    captions = captions.map((c) =>
      typeof c === "string" ? c.trim().slice(0, MAX_CAPTION_LEN) : "",
    );

    const photos = files.map((file, i) => ({
      url: `/uploads/${file.filename}`,
      caption: captions[i] || "",
    }));

    const safeAccent = /^#[0-9A-Fa-f]{6}$/.test(accent) ? accent : "#89B4C8";

    const trip = await Trip.create({
      userId: req.userId,
      place: place.trim().slice(0, FIELD_LIMITS.place),
      region: region.trim().slice(0, FIELD_LIMITS.region),
      dates: dates.trim().slice(0, FIELD_LIMITS.dates),
      summary: summary.trim().slice(0, FIELD_LIMITS.summary),
      cover: photos[0].url,
      photos,
      accent: safeAccent,
      tags: parseTags(req.body.tags),
    });

    res.status(201).json(trip);
  } catch (err) {
    cleanupFiles(req.files);
    console.error("POST trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const { place, region, dates, summary, accent, tags } = req.body;

    if (place !== undefined)
      trip.place = String(place).trim().slice(0, FIELD_LIMITS.place);
    if (region !== undefined)
      trip.region = String(region).trim().slice(0, FIELD_LIMITS.region);
    if (dates !== undefined)
      trip.dates = String(dates).trim().slice(0, FIELD_LIMITS.dates);
    if (summary !== undefined)
      trip.summary = String(summary).trim().slice(0, FIELD_LIMITS.summary);
    if (accent !== undefined && /^#[0-9A-Fa-f]{6}$/.test(accent))
      trip.accent = accent;
    if (tags !== undefined) trip.tags = parseTags(tags);

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error("PUT trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.photos.forEach((photo) => {
      const filepath = path.join(__dirname, "..", photo.url);
      try {
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      } catch (_) {}
    });

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("DELETE trip error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
