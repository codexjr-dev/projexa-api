import { DeleteResult } from 'mongoose';
import Link, { ILink, LinkParameters } from './link.model';
type SearchResult = ILink | null;

async function save(parameters: LinkParameters, organizationID: string): Promise<ILink> {
    return Link.create({
        ...parameters,
        organization: organizationID,
    });
}

async function findByOrganization(organizationID: string): Promise<ILink[]> {
    const links: Promise<ILink[]> = Link.find({ organization: organizationID });
    return links;
}

async function remove(linkId: string): Promise<DeleteResult> {
    const deleteResults = Link.deleteOne({ _id: linkId });
    return deleteResults;
}

async function update(linkId: string, parameters: LinkParameters): Promise<SearchResult> {
    const updatedLink = Link.findOneAndUpdate({ _id: linkId }, parameters);
    return updatedLink;
}

export default {
    findByOrganization,
    remove,
    save,
    update,
};
