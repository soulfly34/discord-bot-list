const Discord = require('discord.js');

module.exports = {
	name: "yardım",
	run: (client, message, args) => {
     var prefix = client.settings.prefix;
     const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setDescription("Ekleyen Botun Sahibi Sunucudan Çıkar ise Bot Otomatik Olarak Banlanır.")
	 .addField("Kullanıcı Komutları", `\`${prefix}bot-ekle\`,\`${prefix}bot-profil\`,\`${prefix}tablo\`,\`${prefix}bot-bilgi\`,\`${prefix}yardım\``)
	 .addField("Yetkili Komutları", `\`${prefix}bot-onayla\`,\`${prefix}bot-reddet\`,\`${prefix}başvuru-liste\`,\`${prefix}bot-sil\`,\`${prefix}kontrol-et\``)
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 return message.channel.send(embed)
  }
}