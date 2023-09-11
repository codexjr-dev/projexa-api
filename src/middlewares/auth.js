const jwt = require("jsonwebtoken");
const Member = require("@member/Member");

module.exports = {
  validatedUser(req, res, next) {
    authorize(req, res, next, "valid");
  },

  authorizedUser(req, res, next) {
    authorize(req, res, next, "user");
  },

  authorizedLeadership(req, res, next) {
    authorize(req, res, next, "leadership");
  },

  authorizePresident(req, res, next) {
    next();
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
      case "valid":
        if (!member)
          return res.status(404).send({ error: "Usuário não existe." });
        break;

      case "user":
        if (!isLeadership(member) && member._id.toString() !== req.body._id)
          return res.status(403).send({ error: "Usuário sem permissão." });
        break;

      case "leadership":
        if (!isLeadership(member))
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
