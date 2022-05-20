const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('verify')
      .setDescription('לאמת את עצמך'),
    async execute(interaction, client) {
const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);
let guild = client.guilds.cache.get("950080386434752572")
let role = guild.roles.cache.get("976848670727208982")
if(executer.roles.cache.find(r => r.id === '976848670727208982')) { interaction.reply({
    content: 'כבר אימתת את עצמך!',
    ephemeral: true
  })} else {
    executer.roles.add(role)
    interaction.reply({
        content: 'אומתת בהצלחה!',
        ephemeral: true
      })
    }

    },
  };