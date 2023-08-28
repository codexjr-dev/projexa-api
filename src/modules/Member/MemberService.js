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

    const psw = await bcrypt.hash(
      `${password}`,
      parseInt(process.env.SALT_ROUNDS)
    );

    const member = await Member.create({
      name,
      email,
      role,
      password,
      birthDate,
      ej: ejId,
      entryDate,
      phone,
      observations,
      habilities,
      department,
    });

    return getDTOmember(member);
  },

  // only for test purposes
  async findByEj(ejId) {
    // const ejs = await Ej.find().populate({ path: 'president', select: 'name -_id' });
    const members = await Member.find({ ej: ejId });

    const membersDTO = members.map((member) => {
      return getDTOmember(member);
    });

    return membersDTO;
  },

  async remove(memberId) {
    const member = await Member.deleteOne({ _id: memberId });
    return member;
  },

  async update(memberId, data) {
    if (data.hasOwnProperty("password")) {
      const psw = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      data.password = psw;
    }

    const updatedMember = await Member.findOneAndUpdate(
      { _id: memberId },
      data
    );

    return getDTOmember(updatedMember);
  },
};

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
