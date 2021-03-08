const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "başvuru-liste",
	run: async(client, message, args) => {
	  const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 
	  if(!message.member.roles.cache.has(client.settings.modRole)) return message.channel.send(embed.setDescription("Sende Bu Komutu Kullanabilmek Gerekli İzin Sende Bulunmuyor"))

	  let obj = await db.get(`serverData.${message.guild.id}.botsData`) || {}
	  let veri = Object.keys(obj).map(botID => {
		return {
		  ID: botID,
		  durum: obj[botID].status
		};
	  }).filter(data => data.durum == "Beklemede")
	  if(veri.length <= 0) return message.channel.send(embed.setDescription("Şuan Beklemede Olan Bot Bulunmuyor")) 
	  
	 return message.channel.send(embed .setDescription(
	  `Sistem Şuan Toplam **${veri.length}** Bot Onay Beklemede! \n\n`+
	  veri.map(data => `(**${data.ID}**) | [Botu Ekle (0)](https://discord.com/oauth2/authorize?client_id=${data.ID}&scope=bot&permissions=0) `).join("\n"))
	  )
  }
}