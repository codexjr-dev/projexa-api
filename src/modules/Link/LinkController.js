const { save, findByEj, remove, update } = require('./LinkService');

module.exports = {
    async save(req, res) {
        try {
            const link = await save(req.body, req.ejId);
            return res.status(201).send({ link: link });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async findByEj(req, res) {
        try {
            const links = await findByEj(req.ejId);
            return res.status(201).send({ links: links });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const removedLink = await remove(req.params.id);
            return res.status(200).send({ project: removedLink, message: 'Link removido com sucesso!' });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updatedLink = await update(req.params.id, req.body);
            return res.status(200).send({ link: updatedLink, message: 'Link atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
}