const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "bot-profil",
	run: async(client, message, args) => {
	let botID = args[0]
	const embed = new Discord.MessageEmbed()
	.setColor("BLUE")
	.setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	.setTimestamp()
	.setFooter(client.user.username, client.user.avatarURL())
	 if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Lütfen Profiline Bakmak İstediğiniz Botun IDsini Yazınız"));
	 let bot = db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	 let discordBot = null;
	 try {
		 discordBot = await client.users.fetch(botID);
	 }	catch {
		return message.channel.send(embed.setDescription("Discord Apide Böyle Bir Bot Bulamadım."));
	 }	
	 
	 if(!bot) return message.channel.send(embed.setDescription(`Sistemde **${discordBot.username}** İsimli Bot Bulamadım.`))
	   let ownerName = await client.users.fetch(bot.owner);
	  embed.addField("Bot Name/ID", `\`${discordBot.username}\`(**${discordBot.id}**)`)
	  .addField("Bot Owner",`\`${ownerName.username}\`(**${ownerName.id}**)`)
	  .addField("Bot Status", 
	  bot.status == "Onaylı" && !message.guild.members.cache.get(botID) 
	  ? "Onaylı (Sunucuda Ekli Değil!)" 
	  : bot.status == "Reddedildi" && message.guild.members.cache.get(botID)  
	  ? "Reddedildi (Bot Sunucuda Ekli)"  
	  : bot.status == "Beklemede"  && message.guild.members.cache.get(botID)
	  ? "Beklemede (Bot Sunucuda Ekli)"
	  : bot.status)
	  if(bot.status == "Reddedildi") embed.addField("Reddedildi Neden", `\`${bot.redReason}\``)
	 message.channel.send(embed)
  }
}