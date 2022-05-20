const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('המתכנטים של הבוט.'),
  async execute(interaction, client) {
    const embed = new client.discord.MessageEmbed()
      .setColor('6d6ee8')
      .setDescription('תוכנת על ידי !Yotam#8888\n\n[<:github:901207749675851816>](https://github.com/Prisaman)  [<:twitter:901207826729418752>](https://twitter.com/spookyprisaman)  [<:twitch:901207801643303012>](https://www.twitch.tv/prisaman)  [<:discord:901207777765130300>](https://discord.gg/uuSwBU9vmw)')
      .setFooter(client.config.footerText, client.user.avatarURL())
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};