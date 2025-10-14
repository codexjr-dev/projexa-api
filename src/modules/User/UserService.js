const bcrypt = require('bcrypt');
const User = require('@user/User');
const Member = require('@member/Member');

const { remove } = require('../Ej/Ej');

module.exports = {
    async save(userData, ejId) {
        const { name, email, role, birthDate, password } = userData
        
        const user = await User.findOne({ email: userData.email });
        if (user) {
            throw new Error('Já existe um usuário cadastrado para esse email!');
        }
        verifyEmptyField(name, 'EMPTY_NAME');
        await verifyEmail(email);
        verifyEmptyField(password, 'EMPTY_PASSWORD');
        verifyEmptyField(role, 'EMPTY_ROLE');
        

        // password auto generated for first access with 6 digits, mockado por enquanto
        const code = 123456 || Math.floor(Math.random() * (999999 - 100000) + 100000);
        const psw = await bcrypt.hash(`${password || code}`, parseInt(process.env.SALT_ROUNDS))

        const newUser = await User.create({
            name: name,
            email: email,
            birthDate: birthDate,
            password: psw,
            role: role,
            ej: ejId
        })

        userData.senhaGerada = password || code;
        userData._id = newUser._id
        return userData;
    },

    async findByEj(ejId) {
        const users = await User.find({ ej: ejId }).select('-password');
        return users;
    },

    async remove(userId) {
        const user = await User.findOne({ _id: userId });
        if(!user) {
            throw new Error('INVALID_ID');
        }
        await checkMinimumQuantity(user);
        
        user.delete();
        
        return user;
    },

    /**
    * Atualiza um usuário existente no sistema
    * @param {String} userId - Id do usuário a ser atualizado.
    * @param {Object} data - Novos valores a serem atualizados.
    * @returns {Object} Retorna o usuário com os dados atualizados.
    */
    async update(userId, data) {
        if (data.hasOwnProperty('password')) {
            const psw = await bcrypt.hash(data.password, parseInt(process.env.SALT_ROUNDS))
            data.password = psw
        }

        const userReq = await User.findOne({_id: userId});
        if (data.hasOwnProperty('email')) {
            if(data.email !== userReq.email){
                await verifyEmail(data.email);
                const user = await User.findOne({ email: data.email });
                if (user) {
                    throw new Error('Já existe um usuário cadastrado para esse email!');
                } 
            }
        }      
        
        if(data.hasOwnProperty("role")){
            //if(!hasPermissionToChange(userReq, data)) {
            //    throw new Error('WITHOUT_PERMISSION');
            //}  verificacao para o user do request ou user logado? 
            if(userReq.role !== data.role && ['Presidente', 'Diretor(a)'].includes(data.role)){
            await checkMinimumQuantity(userReq);
            }
        }
        
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, data);
        return updatedUser;
    }
}

const verifyEmptyField = (field, errorMessage) => {
    if(!field) {throw new Error(errorMessage)};
}

function hasPermissionToChange(member, data) {
   return ['Presidente', 'Diretor(a)'].includes(member.role) ||
   (data.name) === member.name &&
   (data.role) === member.role &&
   (data.email) === member.email;
}

async function checkMinimumQuantity(memberToDelete) {
  const members = await User.find({ ej: memberToDelete.ej });

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

async function verifyAlreadyEmail (userData){
    const user = await User.findOne({ email: userData.email });
        if (user) {
            throw new Error('Já existe um usuário cadastrado para esse email!');
        }
    
}

async function verifyEmail(email) {
    if(!email) throw new Error('EMPTY_EMAIL');
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        throw new Error('INVALID_EMAIL_FORMAT');
    }
    
}