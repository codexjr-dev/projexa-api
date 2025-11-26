import Organization, { IOrganization, OrganizationParameters } from "./organization.model";
import User, { UserParameters } from "../user/user.model";
import bcrypt from "bcrypt";
import { Schema } from "mongoose";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS!);
type SearchResult = UserParameters | null;
type ID = string;
type OrganizationAndMember = {
    organization: OrganizationParameters;
    president: UserParameters;
}

async function save
(name: string, president: UserParameters): Promise<OrganizationAndMember> {
    const alreadyExists = await User.findOne({ email: president.email });
    if (alreadyExists) throw new
        Error("Já existe uma Organização cadastrada para esse email!");
    const organization = (await Organization.create(name)) as IOrganization;

    const password = await bcrypt.hash(president.password!, SALT_ROUNDS);
    const newMember = (await User.create({
        name: president.name,
        email: president.email,
        birthDate: president.birthDate,
        password,
        role: "Presidente",
        organization: organization._id,
    })) as UserParameters;

    delete newMember.password;
    return { organization, president: newMember };
}

async function findAll(): Promise<IOrganization[]> {
    return (await Organization.find()) as IOrganization[];
}

async function findPresident(organizationID: ID): Promise<SearchResult> {
    const president = User.findOne({ role: "Presidente", organization: organizationID });
    return president;
}

async function findById(organizationID: ID): Promise<SearchResult> {
    const organization = Organization.findOne({ _id: organizationID });
    return organization;
}

async function getBalance(organizationID: ID): Promise<number> {
    const organization = await Organization.findOne({ _id: organizationID }) as IOrganization;
    if(!organization){
        throw new Error("Organização não encontrada");
    }
    return organization.balance;
}

async function addFinancialEvent(organizationID: ID, event: any): Promise<number> {
    const organization = await Organization.findOne({ _id: organizationID }) as IOrganization;
    if(!organization){
        throw new Error("Organização não encontrada");
    }
    organization.financialEvents.push(event);
    organization.balance += event.value;
    return organization.balance;
}

async function addRecurrentEvent(organizationID: ID, event: any): Promise<number> {
    const organization = await Organization.findOne({ _id: organizationID }) as IOrganization;
    if(!organization){
        throw new Error("Organização não encontrada");
    }
    organization.recurrentEvents.push(event);
    organization.balance += event.value;
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