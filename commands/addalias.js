const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const config = require('../config.json');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addalias')
        .setDescription('Add an alias to someones radiant.cool email')
        .addStringOption(option =>
            option.setName('original')
                .setDescription('The email you want to add an alias to')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('alias')
                .setDescription('The alias you want to add')
                .setRequired(true)),
    async execute(interaction, client) {
        const chan = client.channels.cache.get(interaction.channelId);
        const original = interaction.options.getString('original');
        const alias = interaction.options.getString('alias');

        if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({ content: "You need to have the <@&" + client.config.roleSupport + "> role.", ephemeral: true })

        try {
            const req = await axios.post('https://mail.radiant.cool/admin/mail/aliases/add',
                new URLSearchParams({
                    "update_if_exists": 0,
                    "address": alias,
                    "forwards_to": original,
                    "permitted_senders": '',
                }),

                {
                    headers: {
                        'Authorization': 'Basic ' + config.mailAPIKey
                    }
                });
            const embed = new client.discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Alias Added')
                .setDescription(`Alias ${alias} added to ${original}`)
                .setFooter('radiant.cool')
                .setTimestamp()

            interaction.reply({
                embeds: [embed]
            })
        } catch (err) {
            // get req from the request above
            console.log(err.response.data);
            console.log('Error occured: ' + err.response.data);
            const embed = new client.discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Command failed')
                .setDescription(`Alias ${alias} could not be created.\n **Error**: ${err.response.data}`)
                .setFooter('radiant.cool')
                .setTimestamp()

            interaction.reply({
                embeds: [embed]
            })
        }

    },
};





