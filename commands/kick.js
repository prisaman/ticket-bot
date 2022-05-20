const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('להעיף מישהו')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('האיש להעיף')
      .setRequired(true))
    .addStringOption(option =>
        option.setName('raison')
        .setDescription('סיבה')
        .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({
      content: 'אין לך גישה  ! (`KICK_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'הבן אדם שאתה רוצה להעיף מעלייך !',
      ephemeral: true
    });

    if (!user.kickable) return interaction.reply({
      content: 'הבן אדם שאתה רוצה להעיף מעליי! לא יכול להעיף אותו.',
      ephemeral: true
    });

    if (interaction.options.getString('raison')) {
      user.kick(interaction.options.getString('raison'))
      interaction.reply({
        content: `**${user.user.tag}** הועף בהצלחה !`
      });
    } else {
      user.kick()
      interaction.reply({
        content: `**${user.user.tag}** הועף בהצלחה !`
      });
    };
  },
};