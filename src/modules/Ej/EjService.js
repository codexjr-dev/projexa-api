const Ej = require('@ej/Ej');
const Member = require('@member/Member');
const bcrypt = require('bcrypt');

module.exports = {
    async save(ejData) {
        const { name } = ejData;
        const { presidentData } = ejData;

        const member = await Member.findOne({ email: presidentData.email });
        if (member) {
            throw new Error('Já existe uma EJ cadastrada para esse email!');
        }

        const ej = await Ej.create({
            name: name
        })

        const psw = await bcrypt.hash(presidentData.password, parseInt(process.env.SALT_ROUNDS))

        const newMember = await Member.create({

            name: presidentData.name,
            email: presidentData.email,
            birthDate: presidentData.birthDate,
            password: psw,
            role: 'Presidente',
            ej: ej._id
        })

        newMember.password = undefined
        return { ej: getDTOej(ej), member: getDTOmember(newMember) }
    },

    // only for test purposes
    async findAll() {
        // const ejs = await Ej.find().populate({ path: 'president', select: 'name -_id' });
        const ejs = await Ej.find();

        const ejsDTO = ejs.map((ej) => {
            return getDTOej(ej);
        });

        return ejsDTO;
    },

    async findPresident(ejId) {
        const president = await Member.findOne({ role: 'presidente', ej: ejId });
        return president;
    },

    async findById(ejId) {
        const ej = await Ej.findOne({ _id: ejId });
        return getDTOej(ej);
    },
}

function getDTOej(ej) {
    return {
        _id: ej._id,
        name: ej.name
    };
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