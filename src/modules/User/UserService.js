const bcrypt = require('bcrypt');
const User = require('@user/User');
const { remove } = require('../Ej/Ej');

module.exports = {
    async save(userData, ejId) {
        const { name, email, role, birthDate, password } = userData
        
        const user = await User.findOne({ email: userData.email });
        if (user) {
            throw new Error('Já existe um usuário cadastrado para esse email!');
        }

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

        userData.senhaGerada = password || code
        userData._id = newUser._id
        return userData;
    },

    async findByEj(ejId) {
        const users = await User.find({ ej: ejId }).select('-password');
        return users;
    },

    async remove(userId) {
        const removedUser = await User.deleteOne({ _id: userId });
        return removedUser
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
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, data)
        return updatedUser
    }
}