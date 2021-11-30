const mongoose = require("mongoose");

// user schema

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 15,
    },
    city: {
      type: String,
      max: 15,
    },
    from: {
      type: String,
      max: 50,
    },
    //enum represents relationship status, 1: single, 2: married, 3: complicated
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
