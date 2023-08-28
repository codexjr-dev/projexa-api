const bcrypt = require('bcrypt');
const Member = require('@member/Member');
const JWT = require('jsonwebtoken');

const signToken = member => {
    return JWT.sign({
        iss: 'TCC',
        sub: member,
        iat: new Date().getTime(),
    }, process.env.JWT_SECRET);
}

module.exports = {
    async signIn(dados) {
        const { email, password } = dados;

        // ao recuperar o objeto 'member', ele conterá o campo 'ej' preenchido com o nome da ej
        const member = await Member.findOne({ email: email }).populate({ path: 'ej', select: 'name' });

        if (!member)
            return { erro: 'Usuário ou senha incorreta' }

        const match = await bcrypt.compare(password, member.password);

        if (!match)
            return { erro: 'Usuário ou senha incorreta' }
        
        delete member._doc.password

        // remove o campo password de 'member' antes de retorná-lo
        const token = signToken(member);


        // return res.status(200).cookie("jwt", token, {sameSite: 'none', path: '/', httpOnly: false , secure: false  }).send({
        return {
            "member": member,
            "token": token // retirar isso em produção
        };
    },
}