const { Schema, model } = require("mongoose");
const Ej = require("@ej/Ej");

const LinkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        enum: ["Importante", "Treinamento", "Documentação"],
        required: false,
      },
    ],
    ej: {
      type: Schema.Types.ObjectId,
      ref: Ej,
      required: true,
    },
    departments: [
      {
        type: String,
        enum: [
          "Presidência",
          "Gente & Gestão",
          "Projetos",
          "Qualidade",
          "Marketing",
          "Negócios",
        ],
        required: false,
      },
    ],
    observations: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Link", LinkSchema);
