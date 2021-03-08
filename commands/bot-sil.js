const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "bot-sil",
	run: async(client, message, args) => {
	
    	let botID = args[0]
		
	    const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL())
		
	    if(!message.member.roles.cache.has(client.settings.modRole)) return message.channel.send(embed.setDescription("Üzgünüm Bu Komutu Kullanabilmek Gerekli İzin Sende Bulunmuyor"))
	    if(message.channel.id !== client.settings.processChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${client.settings.processChannel}> Kanalında Kullanabilirsin!`));
   
		 if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Lütfen Profiline Bakmak istediğiniz Botun IDsini Yazınız"));
		
		 let bot = db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	     let discordBot = null;
         try {
	    	 discordBot = await client.users.fetch(botID);
	     }	catch {
            return message.channel.send(embed.setDescription("Discord Apide Böyle Bir Bot Bulamadım."));
	     }	
		 
		 if(!bot) return message.channel.send(embed.setDescription(`Sistemde **${discordBot.username}** İsimli Bot Bulamadım.`))
    
    if(bot.status == "Onaylı") db.subtract(`serverData.${message.guild.id}.succSize`, 1)
	  if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Reddedildi")  db.subtract(`serverData.${message.guild.id}.redSize`, 1)
    
    db.delete(`serverData.${message.guild.id}.botsData.${botID}`);
     message.react(client.settings.emoji)
    return message.channel.send(embed.setDescription(`**${discordBot.username}** isimli Bot Sistemden Silindi.`))
  }
}