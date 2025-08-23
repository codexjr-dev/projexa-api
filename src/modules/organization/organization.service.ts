import Organization, { IOrganization, OrganizationParameters } from "./organization.model";
import User, { UserParameters } from "../user/user.model";
import bcrypt from "bcrypt";
import { Schema } from "mongoose";
const SALT_ROUNDS = process.env.SALT_ROUNDS!;
type SearchResult = UserParameters | null;
type ID = Schema.Types.ObjectId;
type OrganizationAndMemberPair = {
    organization: OrganizationParameters;
    president: UserParameters;
}

async function save(parameters: OrganizationParameters, presidentData: UserParameters): Promise<OrganizationAndMemberPair> {
    const president = await User.findOne({ email: presidentData.email });
    if (!president) throw new Error(
        "Já existe uma Organização cadastrada para esse email!");
    const org =
        (await Organization.create(parameters)) as OrganizationParameters;

    const password =
        await bcrypt.hash(presidentData.password!, parseInt(SALT_ROUNDS));
    const newMember = (await User.create({
        name: presidentData.name,
        email: presidentData.email,
        birthDate: presidentData.birthDate,
        password,
        role: "Presidente",
        ej: org._id,
    })) as UserParameters;

    delete newMember.password;
    return { organization: org, president: newMember };
}

async function findAll(): Promise<IOrganization[]> {
    return (await Organization.find()) as IOrganization[];
}

async function findPresident(organizationID: ID): Promise<SearchResult> {
    const president = User.findOne({ role: "Presidente", ej: organizationID });
    return president;
}

async function findById(organizationID: ID): Promise<SearchResult> {
    const organization = Organization.findOne({ _id: organizationID });
    return organization;
}

export default {
    findAll,
    findById,
    findPresident,
    save,
}