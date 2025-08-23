import { DeleteResult } from "mongoose";
import Link, { ILink, LinkParameters } from "./link.model";
type SearchResult = ILink | null;

async function save(parameters: LinkParameters, ejId: string): Promise<ILink> {
    return Link.create({
        ...parameters,
        ej: ejId,
    });
}

async function findByEj(ejId: string): Promise<ILink[]> {
    const links: Promise<ILink[]> = Link.find({ ej: ejId });
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
    findByEj,
    remove,
    save,
    update,
};
