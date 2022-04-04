const chalk = require('chalk');

module.exports = {
  name: 'ready',
  execute(client) {
    console.log(chalk.red('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    console.log(chalk.green('Bot Status: ') + chalk.cyan('Online'))
    console.log(chalk.red('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    const oniChan = client.channels.cache.get(client.config.ticketChannel)

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor('6d6ee8')
        .setAuthor('Ticket', client.user.avatarURL())
        .setDescription('Click the button below to open a ticket.')
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
            .setCustomId('open-ticket')
            .setLabel('Open a ticket')
            .setEmoji('✉️')
            .setStyle('PRIMARY'),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }

    oniChan.bulkDelete(100).then(() => {
      sendTicketMSG()
      console.log(chalk.cyan(' Sent the ticket creation widget..'))
    })
  },
};