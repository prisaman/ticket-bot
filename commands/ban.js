const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('הרחקה.')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('הבן אדם להרחיק')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
      .setDescription('סיבה')
      .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({
      content: 'אין לך גישה ! (`BAN_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'הבן אדם שאתה רוצה להעיף מעלייך !',
      ephemeral: true
    });

    if (!user.bannable) return interaction.reply({
      content: 'הבן אדם שאתה רוצה להרחיק הוא מעליי! לא יכול להעיף אותו.',
      ephemeral: true
    });

    if (interaction.options.getString('raison')) {
      user.ban({
        reason: interaction.options.getString('raison'),
        days: 1
      });
      interaction.reply({
        content: `**${user.user.tag}** הורחק בהצלחה !`
      });
    } else {
      user.ban({
        days: 1
      });
      interaction.reply({
        content: `**${user.user.tag}** הורחק בהצלחה !`
      });
    };
  },
};