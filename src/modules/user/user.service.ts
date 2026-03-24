import bcrypt from 'bcrypt';
import Users, { IUser } from './user.model';
import mongoose, { DeleteResult } from 'mongoose';
import ObjectNotFoundError from '../../utils/errors/objectNotFound.error';

/* Relevant Types */
type CleanUser = Omit<IUser, 'password' | '__v'>;
type UserCreationParameters =
    Pick<
        IUser,
        'name'
        | 'email'
        | 'role'
        | 'birthDate'
        | 'password'
        | 'organization'
    >;
type UserUpdateParameters =
    Partial<
        Pick<
            IUser,
            'name'
            | 'email'
            | 'password'
            | 'role'
            | 'birthDate'
            | 'organization'
        >
    >;

/* Constants */
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
const msgEmailExists = 'Já existe um usuário cadastrado para esse email!';
const msgUserNotFound = 'Usuário não encontrado!';
const msgCEONotFound = 'O Presidente desta organização não foi encontrado!';
const msgUsersNotFound = 'Nenhum usuário foi encontrado para esta organização!';

// Helper robusto para extrair o ObjectId real, independente de vir como string, objeto populado ou ObjectId nativo
function parseObjectId(id: any): mongoose.Types.ObjectId {
    // 🚀 CORREÇÃO: Impede crash se a organização vier nula
    if (!id) throw new Error('ID da organização é nulo ou inválido.');
    
    if (id && id._id) return new mongoose.Types.ObjectId(id._id.toString());
    return new mongoose.Types.ObjectId(id.toString());
}

async function save(
    userData: UserCreationParameters
): Promise<CleanUser> {
    const { name, email, role, birthDate, password, organization } = userData;

    // Converte de forma segura
    const orgId = parseObjectId(organization);

    const user: IUser | null = await Users.findOne({ email });
    if (user) throw new Error(msgEmailExists);

    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const createdUser = await Users.create({
        name,
        email,
        birthDate,
        password: encryptedPassword,
        role,
        organization: orgId,
    });

    const newUser: IUser = createdUser.toObject();
    return sanitize(newUser);
}

async function findOne(userID: ID): Promise<CleanUser> {
    const user: IUser | null = await Users
        .findOne({ _id: userID })
        .populate('organization', '_id name')
        .lean();
    if (!user) throw new ObjectNotFoundError(msgUserNotFound);
    return sanitize(user);
}

async function findByOrganization(organizationID: ID): Promise<CleanUser[]> {
    const orgId = parseObjectId(organizationID);
    
    const users: CleanUser[] = await Users
        .find({ organization: orgId })
        .select('-password -__v')
        .lean();

    if (!users || users.length === 0) throw new Error(msgUsersNotFound);
    return users;
}

async function findPresident(organizationId: ID): Promise<CleanUser> {
    const orgId = parseObjectId(organizationId);
    
    const president: CleanUser | null = await Users
        .findOne({ organization: orgId, role: 'Presidente' })
        .select('-password -__v')
        .lean();

    if (!president) throw new ObjectNotFoundError(msgCEONotFound);
    return president;
}

async function remove(userId: ID): Promise<DeleteResult> {
    const result: DeleteResult = await Users
        .deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
        throw new ObjectNotFoundError(msgUserNotFound);
    }

    return result;
}

async function update(
    userId: ID,
    data: UserUpdateParameters
): Promise<CleanUser> {
    if (data.password !== undefined) {
        if (data.password.trim() === '') throw new Error('A senha não pode ser vazia');
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const result: IUser | null = await Users
        .findByIdAndUpdate({ _id: userId }, data, { new: true, runValidators: true })
        .select('-password')
        .lean();

    if (!result) throw new ObjectNotFoundError(msgUserNotFound);
    return sanitize(result);
}

function sanitize(user: IUser): CleanUser {
    const { password, __v, ...otherFields } = user as any;
    return otherFields;
}

export default {
    save,
    findOne,
    findByOrganization,
    findPresident,
    remove,
    update,
}