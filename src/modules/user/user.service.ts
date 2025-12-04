import bcrypt from "bcrypt";
import Users, { IUser } from "./user.model";
import { DeleteResult, Schema } from "mongoose";
import { ID } from "../../utils/common.types";
import ObjectNotFoundError from "../../utils/errors/objectNotFound.error";

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
const SALT_ROUNDS = `${process.env.SALT_ROUNDS}`;
const msgEmailExists = "Já existe um usuário cadastrado para esse email!";
const msgUserNotFound = "Usuário não encontrado!";
const msgCEONotFound = "O Presidente desta organização não foi encontrado!";
const msgUsersNotFound = "Nenhum usuário foi encontrado para esta organização!";

async function save(
    userData: UserCreationParameters,
    organizationID: ID
): Promise<CleanUser> {
    const { name, email, role, birthDate, password } = userData;

    if (typeof organizationID === 'string') {
        organizationID = new Schema.Types.ObjectId(organizationID);
    }

    const user: IUser | null = await Users.findOne({ email });
    if (user) throw new Error(msgEmailExists);

    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const createdUser = await Users.create({
        name,
        email,
        birthDate,
        password: encryptedPassword,
        role,
        organization: organizationID,
    });

    const newUser: IUser = createdUser.toObject();
    return sanitize(newUser);
}

async function findOne(userID: ID): Promise<CleanUser> {
    const user: IUser | null = await Users.findOne({ id: userID });
    if (!user) throw new ObjectNotFoundError(msgUserNotFound);
    return sanitize(user);
}

async function findByOrganization(organizationID: ID): Promise<CleanUser[]> {
    const users: CleanUser[] = await Users
        .find({ organization: organizationID })
        .select("-password -__v")
        .lean();

    if (!users || users.length === 0) throw new Error(msgUsersNotFound);
    return users;
}

async function findPresident(organizationId: ID): Promise<CleanUser> {
    const president: CleanUser | null = await Users
        .findOne({ organization: organizationId, role: 'Presidente' })
        .select("-password -__v")
        .lean();

    if (!president) throw new ObjectNotFoundError(msgCEONotFound);
    return president;
}
async function remove(userId: ID): Promise<DeleteResult> {
    const result: DeleteResult = await Users
        .deleteOne({ id: userId });
    return result;
}

/**
 * Atualiza um usuário existente no sistema.
 * @param {string | ObjectId} userId - ID do usuário a ser atualizado.
 * @param {UserUpdateParameters} data - Novos valores a serem atualizados.
 * Os campos são opcionais.
 * @returns {Promise<CleanUser>} Retorna um objeto com os dados atualizados
 * do usuário, caso a operação tenha sido um sucesso.
 * @throws {ObjectNotFoundError} Caso o ID do usuário não seja encontrado
 * no banco de dados.
 */
async function update(
    userId: ID,
    data: UserUpdateParameters
): Promise<CleanUser> {
    if (data.hasOwnProperty("password")) {
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const result: IUser | null = await Users
        .findByIdAndUpdate({ id: userId }, data)
        .select("-password")
        .lean();

    if (!result) throw new ObjectNotFoundError(msgUserNotFound);
    return sanitize(result);
}

function sanitize(user: IUser): CleanUser {
    const { password, __v, ...otherFields } = user;
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
