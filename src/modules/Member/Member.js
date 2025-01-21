const { Schema, model } = require('mongoose');
const Ej = require('@ej/Ej')

const MemberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Presidente", "Diretor(a)", "Assessor(a)", "Conselheiro(a)", "Pós-Júnior", "Guardiã(o)", "Trainee", "Ex-Trainee"],
        default: "Assessor(a)",
    },
    password: {
        type: String,
        required: true,
    },
    ej: {
        type: Schema.Types.ObjectId,
        ref: Ej,
        required: true
    },
    gender: {
        type: String,
        enum: ["Masculino", "Feminino", "Outro"],
        default: "Masculino",
        required: true
    },
    birthDate: {
        type: Date,
        required: false
    },
    entryDate: {
        type: Date,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    observations: {
        type: String,
        required: false
    },
    abilities: [{
        type: String,
        required: false
    }],
    department: {
        type: String,
        required: false
    }
},
    {
        timestamps: true,
    });

module.exports = model('Member', MemberSchema);