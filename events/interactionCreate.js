let hastebin = require('hastebin');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'כבר פתחת טיקט!',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      }).then(async c => {
        interaction.reply({
          content: `הטיקט נפתח! <#${c.id}>`,
          ephemeral: true
        });

        const embed = new client.discord.MessageEmbed()
          .setColor('6d6ee8')
          .setAuthor('Ticket', 'https://i.imgur.com/oO5ZSRK.png')
          .setDescription('תבחר את הקטגוריה של הטיקט שלך!')
          .setFooter('prisaman.xyz', 'https://i.imgur.com/oO5ZSRK.png')
          .setTimestamp();

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('תבחר את הקטגוריה של הטיקט!')
            .addOptions([{
                label: 'עזרה מהצוות',
                value: 'עזרה', //transaction
                emoji: '👐',
              },
              {
                label: 'לדווח על צוות/ממבר',
                value: 'דיווח', //jeux
                emoji: '📝',
              },
              {
                label: 'אחר',
                value: 'אחר', //autre
                emoji: '📔',
              },
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('6d6ee8')
                  .setAuthor('Ticket', 'https://i.imgur.com/oO5ZSRK.png')
                  .setDescription(`<@!${interaction.user.id}> פתח טיקט ${i.values[0]}`)
                  .setFooter('prisaman.xyz', 'https://i.imgur.com/oO5ZSRK.png')
                  .setTimestamp();

                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('לסגור את הטיקט')
                    .setEmoji('899745362137477181')
                    .setStyle('DANGER'),
                  ); 

                const opened = await c.send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
            if (i.values[0] == 'עזרה') {
              c.edit({
                parent: client.config.parentTransactions
              });
            };
            if (i.values[0] == 'דיווח') {
              c.edit({
                parent: client.config.parentJeux
              });
            };
            if (i.values[0] == 'אחר') {
              c.edit({
                parent: client.config.parentAutres
              });
            };
          };
        }); 

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`לא נבחרה קטגוריה, הטיקט נסגר!`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
                };
              }, 5000);
            });
          };
        });
      });
    };

    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('confirm-close')
          .setLabel('אשר סגירה')
          .setStyle('DANGER'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('לבטל סגירה')
          .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: 'אתה בטוח שאתה רוצה לסגור את הטיקט?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `הטיקט נסגר על ידי: <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
              name: `closed-${chan.name}`,
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: client.config.roleSupport,
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor('6d6ee8')
                .setAuthor('Ticket', 'https://i.imgur.com/oO5ZSRK.png')
                .setDescription('```טיקט קונטרול```')
                .setFooter('prisaman.xyz', 'https://i.imgur.com/oO5ZSRK.png')
                .setTimestamp();

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                  .setCustomId('delete-ticket')
                  .setLabel('לסגור את הטיקט')
                  .setEmoji('🗑️')
                  .setStyle('DANGER'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'סוגר את הטיקט !',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'סוגר את הטיקט !',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: 'שומר את ההודעות...'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Nothing"
        hastebin.createPaste(a, {
            contentType: 'text/plain',
            server: 'https://hastebin.com/'
          }, {})
          .then(function (urlToPaste) {
            const embed = new client.discord.MessageEmbed()
              .setAuthor('Logs Ticket', 'https://i.imgur.com/oO5ZSRK.png')
              .setDescription(`📰 לוג של הטיקט \`${chan.id}\`נפתח על ידי <@!${chan.topic}> ונמחק על ידי <@!${interaction.user.id}>\n\nLogs: [**תלחץ פה כדי לראות את הטיקט**](${urlToPaste})`)
              .setColor('2f3136')
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setAuthor('Logs Ticket', 'https://i.imgur.com/oO5ZSRK.png')
              .setDescription(`📰 הלוג של הטיקט \`${chan.id}\`: [**תלחץ פה כדי לראות את הטיקט**](${urlToPaste})`)
              .setColor('2f3136')
              .setTimestamp();

            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            });
            client.users.cache.get(chan.topic).send({
              embeds: [embed2]
            }).catch(() => {console.log('לא יכול לשלוח לו הודעה:(')});
            chan.send('מוחק את החדר...');

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
      });
    };
  },
};
