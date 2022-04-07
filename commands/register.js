const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const axios = require('axios');
const genPwd = require('../utils/makePwd');
const config = require('../config.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a new user')
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Email address')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to register')
                .setRequired(true)
        ),



    async execute(interaction, client) {
        const email = interaction.options.getString('email');
        const user = interaction.options.getUser('target');
        if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({ content: "You need to have the <@&" + client.config.roleSupport + "> role.", ephemeral: true })
        const pwd = await genPwd(8);
        try {
            const res = await axios.post('https://mail.radiant.cool/admin/mail/users/add', {
                email: email,
                password: pwd,
                privileges: '',
                headers: {
                    'Authorization': 'Basic ' + config.mailAPIKey
                }
            })
            console.log(res.data)
            const embed = new client.discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('User Created')
                .setDescription(`User ${email} created\n Info sent to ${user.username}#${user.discriminator}`)
                .setFooter('radiant.cool')
                .setTimestamp()
            try {
                const embed = new client.discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('User Created')
                    .setDescription(`Email: ${email}\nPassword: ${pwd}\nLogin here: https://mail.radiant.cool/mail`)
                    .setFooter('radiant.cool')
                    .setTimestamp()
                user.send({
                    embeds: [embed]
                })

            } catch (err) {
                const embed = new client.discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('User Created')
                    .setDescription(`Email: ${email}\nPassword: ${pwd}\nLogin here: https://mail.radiant.cool/mail`)
                    .setFooter('radiant.cool')
                    .setTimestamp()

                interaction.reply({
                    embeds: [embed]
                })

            }

        } catch (err) {
            console.log(err);
        }
    }



}