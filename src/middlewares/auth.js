const jwt = require("jsonwebtoken");
const Member = require("@member/Member");
const Project = require("@project/Project");
const News = require("../modules/News/News");

module.exports = {
  existentUser(req, res, next) {
    authorize(req, res, next, "existent");
  },

  authorizedUser(req, res, next) {
    authorize(req, res, next, "authorized");
  },

  isLeadership(req, res, next) {
    authorize(req, res, next, "leadership");
  },

  isMemberOnProject(req, res, next){
    authorize(req, res, next, "team");
  },

  haveRightsToTheNews(req, res, next){
    authorize(req, res, next, "newsOwner");
  },
};

const authorize = (req, res, next, type) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ error: "Requisição sem token." });

  const parts = authHeader.split(" ");

  const [scheme, token] = parts.length === 2 ? parts : [null, null];

  if (scheme === null || !/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token mal formatado." });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token inválido." });

    const member = await Member.findOne({ _id: decoded.sub });

    switch (type) {
      case "existent":
        if (!member)
          return res.status(404).send({ error: "Usuário não existe." });
        break;

      case "authorized":
        if (!isLeadership(member) && member._id.toString() !== req.body._id)
          return res.status(403).send({ error: "Usuário sem permissão." });
        break;

      case "leadership":
        if (!isLeadership(member))
          return res.status(403).send({ error: "Usuário sem permissão." });
        break;

      case "team":
        const project = await Project.findOne({ _id: req.params.projectId });
        if(!isLeadership(member) && !isMemberProject(project, member))
          return res.status(403).send({ error: "Usuário sem permissão." });
        break;

      case "newsOwner":
         const news = await News.findOne({_id: req.body.newsId});
        if(!isLeadership(member) && !isNewsOwner(news, member))
          return res.status(403).send({ error: "Usuário sem permissão." });
        break;
    }

    req.ejId = member.ej;
    req.memberId = member._id;
    return next();
  });
};

const isLeadership = (member) =>
  member && ["Presidente", "Diretor(a)"].includes(`${member.role}`);

const isMemberProject = (project, member) =>
  project && project.team.includes(member._id);

const isNewsOwner = (news, member) =>
   news.member.toString() === member._id.toString();