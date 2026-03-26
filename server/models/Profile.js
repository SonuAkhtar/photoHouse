const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "", trim: true },
  },
  { _id: true },
);

interestSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    bio: { type: String, default: "" },
    quote: { type: String, default: "" },
    gear: { type: [String], default: [] },
    interests: { type: [interestSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
