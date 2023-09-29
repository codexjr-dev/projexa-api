const { Schema, model } = require("mongoose");
const Member = require("@member/Member")

const NewsSchema = new Schema({
    member: {
        type: Schema.Types.ObjectId,
        ref: Member,
        required: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: false 
    },
    updateLink: {
        type: String,
        required: false
    }
},
    {
        timestamps: true,
    });

module.exports = model("News", NewsSchema);