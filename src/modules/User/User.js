const { Schema, model } = require("mongoose");
const Ej = require("@ej/Ej");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Presidente", "Diretor(a)", "Assessor(a)", "Conselheiro(a)"],
      required: true,
      default: "Assessor(a)",
    },
    ej: {
      type: Schema.Types.ObjectId,
      ref: Ej,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
