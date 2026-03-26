const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  if (!this.username && this.name) {
    const base = this.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    this.username = base + Math.floor(1000 + Math.random() * 9000);
  }

  next();
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
