const { save, findByProject, remove, update } = require("./NewsService");

module.exports = {
    async save(req, res) {
        try {
            const news = await save(req.memberId, req.body, req.params.projectId);
            return res.status(201).send({ news: news });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async findByProject(req, res) {
        try {
            const newsAndProject = await findByProject(req.params.projectId);
            return res.status(201).send(newsAndProject);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },

    async update(req, res) {
      try {
          const updatedNews = await update(req.body.newsId, req.body);
          return res.status(200).send({ news: updatedNews, message: 'Atualização do projeto editada com sucesso!' });
      } catch (error) {
          return res.status(500).send({ error: error.message });
      }
    },

    async remove(req, res) {
        try {
            const newsWithoutRemovedNews = await remove(req.params.projectId, req.body);
            return res.status(200).send({ news: newsWithoutRemovedNews, message: "Atualização do projeto removida com sucesso!" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },    
}