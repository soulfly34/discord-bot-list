const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
	name: "bot-bilgi",
	run: (client, message, args) => {
     let inviteUrl = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0`
	 const duration = moment.duration(client.uptime).format('M [Ay],  W [Hafta], D[Gün], H [Saat], m [Dakika]');    
		 const embed = new Discord.MessageEmbed()
		.setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
		.addField("Sunucu Sayısı", client.guilds.cache.size)
		.addField("Üye Sayısı", client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
		.addField("Uptime Süresi", duration)
	    .addField(`Bağlantılar`, ` [[Davet Et]](${inviteUrl}) | [[Destek Sunucusu]](https://discord.gg/9HcSgc8CWJ)`)
        .setFooter(client.user.username, client.user.avatarURL())
		.setDescription("Bot Şuan Global Ortam İçin Kapalıdır.")
		message.channel.send(embed)
  }
}