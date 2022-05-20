const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('remove')
      .setDescription('להוציא מישהו מטיקט')
      .addUserOption(option =>
        option.setName('target')
        .setDescription('האיש להוציא מטיקט')
        .setRequired(true)),
    async execute(interaction, client) {
      const chan = client.channels.cache.get(interaction.channelId);
      const user = interaction.options.getUser('target');
  
      if (chan.name.includes('ticket')) {
        chan.edit({
          permissionOverwrites: [{
            id: user,
            deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
            {
              id: client.config.roleSupport,
              allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
        ],
        }).then(async () => {
          interaction.reply({
            content: `<@${user.id}> הועף מהטיקט !`
          });
        });
      } else {
        interaction.reply({
          content: 'אתה לא בטיקט !',
          ephemeral: true
        });
      };
    },
  };
  