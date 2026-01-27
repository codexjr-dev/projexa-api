import Organization, { IOrganization } from './organization.model';
import User, { IUser } from '../user/user.model';
import bcrypt from 'bcrypt';
import ObjectNotFoundError from '../../utils/errors/objectNotFound.error';

/* Relevant Types */
type CleanUser = Omit<IUser, 'password' | '__v'>;
type CreationResult = {
    organization: IOrganization;
    president: CleanUser;
}
type ID = string;

/* Constants */
const SALT_ROUNDS = 10;
const msgEmailExists = "Já existe uma Organização cadastrada para esse email!";
const msgFoundNone = "Nenhuma organização encontrada";
const msgCEONotFound = "Presidente não encontrado";
const msgOrganizationNotFound = "Organização não encontrada";

async function save(
    name: string,
    president: Partial<IUser>
): Promise<CreationResult> {
    const alreadyExists = await User.findOne({ email: president.email });
    if (alreadyExists) throw new Error(msgEmailExists);

    const organization: IOrganization = await Organization.create({ name });

    const password: string = await bcrypt.hash(president.password!, SALT_ROUNDS);
    const newMember: CleanUser = await User.create({
        name: president.name,
        email: president.email,
        birthDate: president.birthDate,
        password,
        role: 'Presidente',
        organization: organization._id,
    }) as CleanUser;

    return { organization, president: newMember };
}

async function findAll(): Promise<IOrganization[]> {
    const organizations: IOrganization[] = await Organization.find();

    if (!organizations || organizations.length === 0) {
        throw new ObjectNotFoundError(msgFoundNone);
    }
    return organizations;
}

async function findPresident(organizationID: ID): Promise<CleanUser> {
    const president: CleanUser | null = await User
        .findOne({ role: 'Presidente', organization: organizationID })
        .select('-password -__v');

    if (!president) throw new ObjectNotFoundError(msgCEONotFound);
    return president;
}

async function findById(organizationID: ID): Promise<IOrganization> {
    const organization: IOrganization | null = await Organization
        .findOne({ _id: organizationID });

    if (!organization) throw new ObjectNotFoundError(msgOrganizationNotFound);
    return organization;
}

async function getBalance(organizationID: ID): Promise<number> {
    const organization = await Organization.findById(organizationID);
    if (!organization) {
        throw new Error(msgOrganizationNotFound);
    }

    return organization.balance;
}

async function addFinancialEvent(organizationID: ID, event: any): Promise<number> {
    const organization = await Organization.findById(organizationID);
    if (!organization) {
        throw new Error(msgOrganizationNotFound);
    }
    organization.financialEvents.push(event);
    organization.balance += event.value;

    await organization.save();

    return organization.balance;
}

async function addRecurrentEvent(organizationID: ID, event: any): Promise<number> {
    const organization = await Organization.findById(organizationID);
    if (!organization) {
        throw new Error(msgOrganizationNotFound);
    }
    organization.recurrentEvents.push(event);
    
    await organization.save();
    return organization.balance;
}

export default {
    findAll,
    findById,
    findPresident,
    save,
    getBalance,
    addFinancialEvent,
    addRecurrentEvent,
}