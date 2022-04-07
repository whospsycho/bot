const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const config = require('../config.json');
const fetch = require('node-fetch');
const { default: axios } = require('axios');
const FormData = require('form-data');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite someone to radiant.cool')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to invite')
                .setRequired(false)),
    async execute(interaction, client) {

        if (!interaction.member.roles.cache.find(r => r.id === config.roleSupport)) return interaction.reply({ content: "You need to have the <@&" + config.roleSupport + "> role.", ephemeral: true })

        const user = interaction.options.getUser('user');

        const form = new FormData();

        const options = {
            method: 'POST',
            url: 'https://api.radiant.cool/admin/makeInvite',
            headers: {
                'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                authorization: `${config.adminToken}`
            },
            data: '[form]'
        };

        axios.request(options).then(function (resp) {
            if (user) {
                if (resp.data.success) {
                    const embed = new client.discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle("You've been invited to radiant.cool!")
                        .setDescription(`You've been invited to radiant.cool!\n\n**Use the invite below to join!**\n${resp.data.invite.code}`)
                        .setFooter('radiant.cool')
                        .setTimestamp()

                    user.send({
                        embeds: [embed]
                    })
                } else {
                    interaction.reply({
                        content: "Something went wrong. Please try again later.",
                        ephemeral: true
                    })
                }
            } else {
                if (resp.data.success) {
                    const embed = new client.discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle("Invite successfully created!")
                        .setDescription(`Invite:\n${resp.data.invite.code}`)
                        .setFooter('radiant.cool')
                        .setTimestamp()

                    interaction.reply({
                        embeds: [embed]
                    })
                } else {
                    interaction.reply({
                        content: "Something went wrong. Please try again later.",
                        ephemeral: true
                    })
                }

            }

        }).catch(function (error) {
            console.error(error);
            interaction.reply({
                content: "Something went wrong. Please try again later. Error: " + error,
            });




        }
        )
    }

}

