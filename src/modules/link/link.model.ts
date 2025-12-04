import { Schema, model } from 'mongoose';
import Organization from '../organization/organization.model';
import { ID } from '../../utils/common.types';

type Tag = 'Importante' | 'Treinamento' | 'Documentação';
type Department =
    'Presidência' |
    'Gente & Gestão' |
    'Projetos' |
    'Qualidade' |
    'Marketing' |
    'Negócios';

interface ILink {
    name: string;
    url: string;
    tags: Tag[];
    organization: ID;
    departments: Department[];
    observations: string;
}

interface LinkParameters extends Partial<ILink> { };

const linkSchema = new Schema<ILink>({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        enum: ['Importante', 'Treinamento', 'Documentação'],
        required: false,
    },],
    organization: {
        type: Schema.Types.ObjectId,
        ref: Organization,
        required: true,
    },
    departments: [{
        type: String,
        enum: [
            'Presidência',
            'Gente & Gestão',
            'Projetos',
            'Qualidade',
            'Marketing',
            'Negócios',
        ],
        required: false,
    },],
    observations: {
        type: String,
        required: false,
    }
}, { timestamps: true });

export default model('Link', linkSchema);
export { ILink, LinkParameters };
