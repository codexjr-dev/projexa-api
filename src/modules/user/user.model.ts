import { Schema, model, Document } from 'mongoose';
import organization from '../organization/organization.model';

// Tipagens provisórias baseadas no seu código
interface MongooseObject extends Document {}
interface HasTimeStamps {
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUser extends MongooseObject, HasTimeStamps {
    name: string;
    email: string;
    password: string;
    role:
        'Presidente' | 'Diretor(a)' | 'Assessor(a)' |
        'Conselheiro(a)' | 'Pós-Júnior' | 'Guardião' |
        'Trainee' | 'Ex-Trainee';
    birthDate: Date;
    organization: Schema.Types.ObjectId;
}

type CleanUser = Omit<IUser, 'password' | '__v'>;

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Necessário para o Teste 59 (colisão de email)
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'], // Necessário para os Testes 48 e 60
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [
            'Presidente', 'Diretor(a)', 'Assessor(a)',
            'Conselheiro(a)','Pós-Júnior', 'Guardião', // Corrigi aqui para ficar igual à Interface
            'Trainee', 'Ex-Trainee'
        ],
        required: true,
        default: 'Assessor(a)',
    },
    birthDate: {
        type: Date,
        required: true,
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization', // Ideal passar como string referenciando o nome do model
        required: true,
    },
},
{ timestamps: true });

export default model<IUser>('User', userSchema);
export { IUser, CleanUser };