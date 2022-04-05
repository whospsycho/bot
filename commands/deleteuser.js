const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { default: axios } = require('axios');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteuser')
        .setDescription('Delete a user account')
        .addStringOption(option =>
            option.setName('email')
                .setDescription('The email of the user you want to delete')
                .setRequired(true)),
    async execute(interaction, client) {
        const email = interaction.options.getString('email');

        if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({ content: "You need to have the <@&" + client.config.roleSupport + "> role.", ephemeral: true })
        try {
            const req = await axios.post('https://mail.radiant.cool/admin/mail/users/remove',
                new URLSearchParams({
                    "email": email,
                }),
                {
                    headers: {
                        'Authorization': 'Basic ' + config.mailAPIKey
                    }
                });

            const embed = new client.discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('User Deleted')
                .setDescription(`User ${email} deleted`)
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
                .setDescription(`User ${email} could not be deleted.\n **Error**: ${err.response.data}`)
                .setFooter('radiant.cool')
                .setTimestamp()

            interaction.reply({
                embeds: [embed]
            })
        }





    }
};
