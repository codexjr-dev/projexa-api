const { save, findByEj, findById, remove, update } = require('./ProjectService');

module.exports = {
    async save(req, res) {
        try {
            const project = await save(req.body, req.ejId);
            return res.status(201).send({ project: project });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async findByEj(req, res) {
        try {
            const projects = await findByEj(req.ejId);
            return res.status(201).send({ projects: projects });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async findById(req, res) {
        try {
            const project = await findById(req.params.id);
            return res.status(200).send({project: project});
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const removedproject = await remove(req.params.id);
            return res.status(200).send({ project: removedproject, message: 'Projeto removido com sucesso!' });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updatedProject = await update(req.params.id, req.body);
            return res.status(200).send({ project: updatedProject, message: 'Projeto atualizado com sucesso!' });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
}