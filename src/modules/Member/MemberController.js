const { save, findByEj, remove, update } = require("./MemberService");

module.exports = {
  async save(req, res) {
    try {
      const member = await save(req.body, req.ejId);
      return res.status(201).send({ member: member });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  async findByEj(req, res) {
    try {
      const members = await findByEj(req);
      return res.status(200).send({ members: members });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      const removedMember = await remove(req.params.id);
      return res
        .status(200)
        .send({
          member: removedMember,
          message: "Membero removido com sucesso!",
        });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const updatedMember = await update(req.params.id, req.body);
      return res
        .status(200)
        .send({
          member: updatedMember,
          message: "Membro atualizado com sucesso!",
        });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};
