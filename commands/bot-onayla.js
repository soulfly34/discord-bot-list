const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "bot-onayla",
	run: async(client, message, args) => {
     const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())

	  if(!message.member.roles.cache.has(client.settings.modRole)) return message.channel.send(embed.setDescription("Üzgünüm Bu Komutu Kullanabilmek Gerekli İzin Sende Bulunmuyor"))
      if(message.channel.id !== client.settings.processChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${client.settings.processChannel}> Kanalında Kullanabilirsin!`));
	  let botID = args[0];
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Onaylamak İstediğiniz Botun ID sini Belirtiniz."));
	  
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("Discord Apide Böyle Bir Bot Bulamadım."));
	  }	
	
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  if(!bot) return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Sisteme Daha Önceden Eklenmemiş.`));
	 	

      if(bot.status == "Onaylı") {
		  if(!message.guild.members.cache.get(botID)){
			  return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Onaylanmış ama Sunucuda Mevcut Değil!`))
		  }
		   return message.channel.send(embed.setDescription(`**${discordBot.username}** Adlı Bot Zaten Onaylanmış Durumda!`))
	  }
	  let memberData = await client.users.fetch(bot.owner)

      if(!message.guild.members.cache.get(bot.owner)) return message.channel.send(embed.setDescription(`**${memberData.username}** Adlı Kullanıcı Sunucudan Çıktığından Bot Onaylanamaz!`));
	 message.guild.members.cache.get(bot.owner).roles.add(client.settings.devRole)
    if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Reddedildi")  db.subtract(`serverData.${message.guild.id}.redSize`, 1)
	  db.add(`serverData.${message.guild.id}.succSize`, 1);
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Onaylı")
	   message.react(client.settings.emoji)
	  message.guild.channels.cache.get(client.settings.logChannel).send(
	  embed.setDescription(`${memberData} (**${memberData.tag}**) Adlı Kişinin \`${discordBot.tag}\`(**${discordBot.id}**) Adlı Botu Onaylandı!`)
	  )
  }
}