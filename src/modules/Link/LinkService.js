const Link = require('./Link');

module.exports = {
    async save(linkData, ejId) {
        const { name, url, tags, departments, observations } = linkData;

        const link = await Link.create({
            name,
            url,
            tags,
            departments: departments,
            ej: ejId,
            observations
        })

        return getDTOlink(link);
    },

    // only for test purposes
    async findByEj(ejId) {
        // const ejs = await Ej.find().populate({ path: 'president', select: 'name -_id' });
        const links = await Link.find({ ej: ejId });

        const linksDTO = links.map((link) => {
            return getDTOlink(link);
        });

        return linksDTO;
    },

    async remove(linkId) {
        const link = await Link.deleteOne({ _id: linkId });
        return getDTOlink(link);
    },

    async update(linkId, data) {
        const updatedLink = await Link.findOneAndUpdate({ _id: linkId }, data)
        return getDTOlink(updatedLink);
    }
}

function getDTOlink(link) {
    return {
        _id: link._id,
        name: link.name,
        url: link.url,
        tags: link.tags,
        departments: link.departments,
        ej: link.ej,
        observations: link.observations
    }
}