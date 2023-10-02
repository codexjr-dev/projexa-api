const bcrypt = require("bcrypt");
const Ej = require("@ej/Ej");
const Member = require("@member/Member");

module.exports = {
  async save(memberData, ejId) {
    const {
      name,
      email,
      role,
      password,
      birthDate,
      entryDate,
      phone,
      observations,
      habilities,
      department,
    } = memberData;

    await verifyEmail(email);

    const psw = await bcrypt.hash(
      `${password}`,
      parseInt(process.env.SALT_ROUNDS)
    );

    const newMember = await Member.create({
      name,
      email,
      role,
      password: psw,
      birthDate,
      ej: ejId,
      entryDate,
      phone,
      observations,
      habilities,
      department,
    });

    return getDTOmember(newMember);
  },

  // only for test purposes
  async findByEj(req) {
    // const ejs = await Ej.find().populate({ path: 'president', select: 'name -_id' });
    const members = await Member.find({ ej: req.ejId });

    const membersDTO = members.map((member) => {
      if (member._id.toString() === req.memberId.toString())
        return { ...getDTOmember(member), ...{ loged: true } };
      return getDTOmember(member);
    });

    return membersDTO;
  },

  async remove(memberId) {
    const member = await Member.findOne({ _id: memberId });

    await checkMinimumQuantity(member);

    member.delete();

    return getDTOmember(member);
  },

  async update(memberId, data) {
    if (data.hasOwnProperty("password")) {
      const psw = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      data.password = psw;
    }
  
    const member = await Member.findOne({ _id: memberId });

    if (!hasPermissionToChange(member, data)) throw new Error('WITHOUT_PERMISSION');
    
    if (member.email !== data.email) {
      await verifyEmail(data.email);
    }

    if (
      member.role !== data.role &&
      !["Presidente", "Diretor(a)"].includes(data.role)
    )
      await checkMinimumQuantity(member);

    await member.updateOne(data);
    const updatedMember = await Member.findOne({ _id: memberId });
    return getDTOmember(updatedMember);
  },
};

async function verifyEmail(email) {
  if (!email) {
    throw new Error('EMPTY_EMAIL');
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error('INVALID_EMAIL_FORMAT');
  }

  const emailInUse = await Member.findOne({ email: email });
  if (emailInUse) {
    throw new Error('EMAIL_ALREADY_IN_USE');
  }
}

function getDTOmember(member) {
  return {
    _id: member._id,
    name: member.name,
    email: member.email,
    role: member.role,
    ej: member.ej,
    birthDate: member.birthDate,
    entryDate: member.entryDate,
    phone: member.phone,
    observations: member.observations,
    habilities: member.habilities,
    department: member.department,
  };
}

async function checkMinimumQuantity(memberToDelete) {
  const members = await Member.find({ ej: memberToDelete.ej });

  let hasALeadership = false;

  members
    .filter((member) => member._id.toString() !== memberToDelete._id.toString())
    .forEach((member) => {
      if (["Presidente", "Diretor(a)"].includes(member.role)) {
        hasALeadership = true;
        return;
      }
    });

  if (!hasALeadership) {
    throw new Error(
      "A presença de ao menos um outro usuário com o cargo de Presidente ou Diretor(a) na EJ é obrigatória."
    );
  }

  if (members.length <= 1)
    throw new Error("A presença de ao menos um usuário na EJ é obrigatória.");
}

function hasPermissionToChange(member, data) {
   return ['Presidente', 'Diretor(a)'].includes(member.role) ||
   data.name === data.name &&
   new Date(data.birthDate).getTime() === member.birthDate.getTime() &&
   new Date(data.entryDate).getTime() === member.entryDate.getTime() &&
   data.department === member.department &&
   data.role === member.role &&
   data.email === member.email &&
   data.phone === member.phone &&
   data.observations === member.observations
}