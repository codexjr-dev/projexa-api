const bcrypt = require('bcrypt');
const User = require('@user/User');
const JWT = require('jsonwebtoken');

const signToken = user => {
    return JWT.sign({
        iss: 'TCC',
        sub: user,
        iat: new Date().getTime(),
    }, process.env.JWT_SECRET);
}

module.exports = {
    async signIn(dados) {
        const { email, password } = dados;
        const user = await User.findOne({ email: email }).populate({ path: 'ej', select: 'name' });

        if (!user)
            return { erro: 'Usuário ou senha incorreta' }

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return { erro: 'Usuário ou senha incorreta' }
        
        delete user._doc.password

        const token = signToken(user);


        // return res.status(200).cookie("jwt", token, {sameSite: 'none', path: '/', httpOnly: false , secure: false  }).send({
        return {
            "user": user,
            "token": token // retirar isso em produção
        };
    },
}