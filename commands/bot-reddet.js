const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "bot-reddet",
	run: async(client, message, args) => {
      const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())

	  if(!message.member.roles.cache.has(client.settings.modRole)) return message.channel.send(embed.setDescription("Üzgünüm Bu Komutu Kullanabilmek Gerekli İzin Sende Bulunmuyor"))
	  if(message.channel.id !== client.settings.processChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${client.settings.processChannel}> Kanalında Kullanabilirsin!`));
      let botID = args[0];
      let redReason = args.slice(1).join(' ');
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Reddetmek istediğiniz Botun ID sini Belirtiniz."));
	  if(!redReason) return message.channel.send(embed.setDescription("Lütfen Bir Sebeb Belirtiniz."));
	  
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("Discord Apide Böyle Bir Bot Bulamadım."));
	  }	
	  
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  if(!bot) return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Sisteme Daha Önceden Eklenmemiş.`));

	  if(bot.status == "Reddedildi")  return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Zaten Reddedilmiş Durumda!`))
	  if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Onaylı")  db.subtract(`serverData.${message.guild.id}.succSize`, 1)
       let memberData = await client.users.fetch(bot.owner)
   
       if(message.guild.members.cache.get(bot.owner)) message.guild.members.cache.get(bot.owner).roles.remove(client.settings.devRole)
		   
	   db.add(`serverData.${message.guild.id}.redSize`, 1);
	   db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Reddedildi")
	   db.set(`serverData.${message.guild.id}.botsData.${botID}.redReason`, redReason)
	  message.guild.channels.cache.get(client.settings.logChannel).send(
	   embed.setDescription(`${memberData} (**${memberData.tag}**) Adlı Kişinin \`${discordBot.tag}\`(**${discordBot.id}**) Adlı Botu \`${redReason}\` Sebebi ile Reddedildi!`)
	  
	  )
	   message.react(settings.emoji)
  }
}