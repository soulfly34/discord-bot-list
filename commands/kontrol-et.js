const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "kontrol-et",
	run: async(client, message, args) => {
	  if(!message.member.roles.cache.has(client.settings.modRole)) return message.channel.send(embed.setDescription("Üzgünüm Bu Komutu Kullanabilmek Gerekli İzin Sende Bulunmuyor"))

      let obj = await db.get(`serverData.${message.guild.id}.botsData`) || {}
	  let array1 = []
	  let array2 = []
	  let array3 = []
	  let veri = Object.keys(obj).forEach(botID => {
        if(obj[botID].status == "Onaylı" && !message.guild.members.cache.get(botID)){
		   array1.push({ID:botID})
		} else if(obj[botID].status == "Reddedildi" && message.guild.members.cache.get(botID)){
		    array2.push({ID:botID})
		} else if(obj[botID].status == "Beklemede" && message.guild.members.cache.get(botID)){
		   array3.push({ID:botID})
		}
	  })
	  let botEkle = (ID) => `https://discord.com/oauth2/authorize?client_id=${ID}&scope=bot&permissions=0` 
	 let map = (arr) => arr.map(data => `(**${data.ID}**) | [Bot Ekle (0)](${botEkle(data.ID)})`).slice(0, 5).join("\n")
	  let map2 = (arr) => arr.map(data => `<@${data.ID}>`).join(", ")
	    const embed = new Discord.MessageEmbed()
		.setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .addField("**Onaylı ve Ekli Olmayanlar**",  array1.length > 5 ? map(array1) + ".." : array1.length >= 1 ? map(array1) : "Liste Boş") 
	    .addField("**Reddedilmiş ve Ekli Olanlar**",  array2.length > 5 ? map2(array2).slice(0, 5) + ".." : array2.length >= 1 ? map2(array2) :"Liste Boş")
		.addField("**Beklemede ve Ekli Olanlar**",  array3.length > 5 ? map2(array3).slice(0, 5) + ".." : array3.length >= 1 ? map2(array3) :"Liste Boş")
	    .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL())
		message.channel.send(embed)
  }
}