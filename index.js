/*
  # Discord Bot List Botu
  # Soulfly Taraf�ndan Yap�lm��t�r, Payla��lmas�, Editlenip Payla��lmas� ve Ba�ka Altyap� �le Ayn� Kodlar�n Kullan�lmas� Yasakt�r.
  # MIT Lisance ile Korunmaktad�r.
  # Support: https://discord.gg/9HcSgc8CWJ
*/

const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, disableMentions: 'everyone'});
// Botunuz Onayl� ve Baz� Intentsler A��k De�ilse Ona G�re Yaz�n�z.
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');

let settings = {
	prefix: "!",
	token:"",
 }
 
client.on('ready', () => {
	client.user.setStatus('online');
    client.user.setActivity(`Soulfly | ${settings.prefix}yard�m`, {type: "PLAYING"});
    console.log("Ba�ar�l� Bir �ekilde Aktif Oldum.")
})

client.on('message', async message => {
	if(message.author.bot || !message.guild || db.get(`memberData.${message.author.id}.darkMember`)) return;
	let addChannel =  db.get(`serverData.${message.guild.id}.addChannel`);
	let logChannel =  db.get(`serverData.${message.guild.id}.logChannel`);
	let modRole =  db.get(`serverData.${message.guild.id}.modRole`);
	let prefix = settings.prefix;
    if(message.channel.id == addChannel) message.delete({timeout: 3000})
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
	if(command == "bot-ekle"){
    if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
      const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	
	  if(message.channel.id !== addChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${addChannel}> Kanal�nda Kullanabilirsin!`));
	  
	  let botID = args[0];
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("L�tfen Eklemek �stedi�iniz Botun ID sini Giriniz."));
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("Discord Apide B�yle Bir Bot Bulamad�m."));
	  }		

	  if(!discordBot.bot) return message.channel.send(embed.setDescription("L�tfen Bot IDsi Giriniz, Kullan�c� ID Girmeyin!"));
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  
 
	  if(bot) {
		let member = await client.users.fetch(bot.owner);
        return message.channel.send(`<a:cryptored:773593317853626368> **${discordBot.username}** Adl� Bot Sisteme **${member.username}** Taraf�ndan Eklenmi� Durum; **${bot.status}**`)
	 }
	
	  db.add(`serverData.${message.guild.id}.waitSize`, 1)
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.owner`,  message.author.id)
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Beklemede")
	  
      let s�ra = db.fetch(`serverData.${message.guild.id}.waitSize`) || 0;
	   
	message.guild.channels.cache.get(logChannel).send(
	  embed
	  .setDescription(`Sisteme Bir Bot Eklendi, Bu Bot �le S�rada Toplam **${s�ra}** Bot Mevcut!`)
	  .addField("**Ekleyen Hakk�nda**",`${message.author} (**${message.author.tag}**)`)
	  .addField("**Bot Hakk�nda**", `\`${discordBot.tag}\`(**${discordBot.id}**)`)
	  )
       // message.react("727544033697595583")
	}  else if(command == "bot-onayla"){
	  if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
      const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())

	  if(!message.member.roles.cache.has(modRole)) return message.channel.send(embed.setDescription("�zg�n�m Bu Komutu Kullanabilmek Gerekli �zin Sende Bulunmuyor"))
     // if(message.channel.id !== settings.i�lemChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${settings.i�lemChannel}> Kanal�nda Kullanabilirsin!`));
	  let botID = args[0];
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Onaylamak �stedi�iniz Botun ID sini Belirtiniz."));
	  
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("Discord Apide B�yle Bir Bot Bulamad�m."));
	  }	
	
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  if(!bot) return message.channel.send(embed.setDescription(`**${discordBot.username}** Adl� Bot Sisteme Daha �nceden Eklenmemi�.`));
	 	

      if(bot.status == "Onayl�") {
		  if(!message.guild.members.cache.get(botID)){
			  return message.channel.send(embed.setDescription(`**${discordBot.username}** Adl� Bot Onaylanm�� ama Sunucuda Mevcut De�il!`))
		  }
		   return message.channel.send(embed.setDescription(`**${discordBot.username}** Adl� Bot Zaten Onaylanm�� Durumda!`))
	  }
	  let memberData = await client.users.fetch(bot.owner)

      if(!message.guild.members.cache.get(bot.owner)) return message.channel.send(embed.setDescription(`**${memberData.username}** Adl� Kullan�c� Sunucudan ��kt��� ��in Bot Onaylanamaz!`));
	 message.guild.members.cache.get(bot.owner).roles.add("772859423008751647")
    if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Reddedildi")  db.subtract(`serverData.${message.guild.id}.redSize`, 1)
	  db.add(`serverData.${message.guild.id}.succSize`, 1);
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Onayl�")
	   message.react("773593317756633109")
	  message.guild.channels.cache.get(logChannel).send(
	  embed.setDescription(`${memberData} (**${memberData.tag}**) Adl� Ki�inin \`${discordBot.tag}\`(**${discordBot.id}**) Adl� Botu Onayland�!`)
	  )
	} else if(command == "bot-reddet"){
		  if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
      const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())

	  if(!message.member.roles.cache.has(modRole)) return message.channel.send(embed.setDescription("�zg�n�m Bu Komutu Kullanabilmek Gerekli �zin Sende Bulunmuyor"))
	 // if(message.channel.id !== settings.i�lemChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${settings.i�lemChannel}> Kanal�nda Kullanabilirsin!`));
      let botID = args[0];
      let redReason = args.slice(1).join(' ');
      if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("Reddetmek �stedi�iniz Botun ID sini Belirtiniz."));
	  if(!redReason) return message.channel.send(embed.setDescription("L�tfen Bir Sebeb Belirtiniz."));
	  
	  let discordBot = null;
      try {
		  discordBot = await client.users.fetch(botID);
	  }	catch {
          return message.channel.send(embed.setDescription("Discord Apide B�yle Bir Bot Bulamad�m."));
	  }	
	  
	  let bot =  db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	  if(!bot) return message.channel.send(embed.setDescription(`**${discordBot.username}** Adl� Bot Sisteme Daha �nceden Eklenmemi�.`));
	  if(message.guild.members.cache.get(botID)){
		 message.guild.members.cache.get(botID).kick({reason: "Bot Reddedildi"})
		 message.channel.send(embed.setDescription(`**${discordBot.username}** Adl� Bot Reddedildi�i ��in ve Sunucuda Oldu�u ��in Kickledim.`))
	  }
	  if(bot.status == "Reddedildi")  return message.channel.send(embed.setDescription(`**${discordBot.username}** Adl� Bot Zaten Reddedilmi� Durumda!`))
	  if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Onayl�")  db.subtract(`serverData.${message.guild.id}.succSize`, 1)
       let memberData = await client.users.fetch(bot.owner)
       if(message.guild.members.cache.get(bot.owner)) message.guild.members.cache.get(bot.owner).roles.remove("772859423008751647")
	  db.add(`serverData.${message.guild.id}.redSize`, 1);
	  db.set(`serverData.${message.guild.id}.botsData.${botID}.status`, "Reddedildi")
	   db.set(`serverData.${message.guild.id}.botsData.${botID}.redReason`, redReason)
	  message.guild.channels.cache.get(logChannel).send(
	   embed.setDescription(`${memberData} (**${memberData.tag}**) Adl� Ki�inin \`${discordBot.tag}\`(**${discordBot.id}**) Adl� Botu \`${redReason}\` Sebebi �le Reddedildi!`)
	  
	  )
	//   message.react("773593317756633109")
	} else if(command == "ba�vuru-liste"){
	  if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
	  const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 
	  if(!message.member.roles.cache.has(modRole)) return message.channel.send(embed.setDescription("�zg�n�m Bu Komutu Kullanabilmek Gerekli �zin Sende Bulunmuyor"))
	//  if(message.channel.id !== settings.i�lemChannel) return message.channel.send(embed.setDescription(`Bu Komutu Sadece <#${settings.i�lemChannel}> Kanal�nda Kullanabilirsin!`));
	   
	  let obj = await db.get(`serverData.${message.guild.id}.botsData`) || {}
	  let veri = Object.keys(obj).map(botID => {
		return {
		  ID: botID,
		  durum: obj[botID].status
		};
	  }).filter(data => data.durum == "Beklemede")
	  if(veri.length <= 0) return message.channel.send(embed.setDescription("�uan Beklemede Olan Bot Bulunmuyor")) 

	 return message.channel.send(embed .setDescription(
	  `Sistem �uan Toplam **${veri.length}** Bot Onay Beklemede! \n\n`+
	  veri.map(data => `(**${data.ID}**) | [Botu Ekle (0)](https://discord.com/oauth2/authorize?client_id=${data.ID}&scope=bot&permissions=0) `).join("\n"))
	  )
   } else if(command == "yard�m"){
     const embed = new Discord.MessageEmbed()
     .setColor("BLUE")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	 .setDescription("E�er Botun Sahibi Sunucudan ��kar ise Bot Otomatik Olarak Banlan�r.")
	 .addField("Kullan�c� Komutlar�", `\`${prefix}bot-ekle\`,\`${prefix}bot-profil\`,\`${prefix}tablo\`,\`${prefix}bot-bilgi\`,\`${prefix}yard�m\``)
	 .addField("Yetkili Komutlar�", `\`${prefix}bot-onayla\`,\`${prefix}bot-reddet\`,\`${prefix}ba�vuru-liste\`,\`${prefix}bot-sil\`,\`${prefix}kontrol-et\``)
	 .setTimestamp()
     .setFooter(client.user.username, client.user.avatarURL())
	 return message.channel.send(embed)
	} else if(command == "bot-profil"){
		if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
		let botID = args[0]
	    const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL())
		 if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("L�tfen Profiline Bakmak �stedi�iniz Botun IDsini Yaz�n�z"));
		 let bot = db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	     let discordBot = null;
         try {
	    	 discordBot = await client.users.fetch(botID);
	     }	catch {
            return message.channel.send(embed.setDescription("Discord Apide B�yle Bir Bot Bulamad�m."));
	     }	
		 
		 if(!bot) return message.channel.send(embed.setDescription(`Sistemde **${discordBot.username}** �simli Bot Bulamad�m.`))
           let ownerName = await client.users.fetch(bot.owner);
          embed.addField("Bot Name/ID", `\`${discordBot.username}\`(**${discordBot.id}**)`)
		  .addField("Bot Owner",`\`${ownerName.username}\`(**${ownerName.id}**)`)
		  .addField("Bot Status", 
		  bot.status == "Onayl�" && !message.guild.members.cache.get(botID) 
		  ? "Onayl� (Sunucuda Ekli De�il!)" 
		  : bot.status == "Reddedildi" && message.guild.members.cache.get(botID)  
		  ? "Reddedildi (Bot Sunucuda Ekli)"  
          : bot.status == "Beklemede"  && message.guild.members.cache.get(botID)
          ? "Beklemede (Bot Sunucuda Ekli)"
		  : bot.status)
		  if(bot.status == "Reddedildi") embed.addField("Reddedildi Neden", `\`${bot.redReason}\``)
		 message.channel.send(embed)
	        
	 
   } else if(command == "tablo"){
	  if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
	   let succSize = db.get(`serverData.${message.guild.id}.succSize`) || 0;
	   let waitSize = db.get(`serverData.${message.guild.id}.waitSize`) || 0;
	   let redSize = db.get(`serverData.${message.guild.id}.redSize`) || 0;
	   
	    const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
        .setDescription(`Toplam Botlar; **${succSize + waitSize + redSize}**\nOnaylanan Botlar; **${succSize}**\nBekleyen Botlar; **${waitSize}**\nReddedilen Botlar; **${redSize}**`)
        .setFooter(client.user.username, client.user.avatarURL())
	 message.channel.send(embed)
   } else if(command == "bot-bilgi"){
     let inviteUrl = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0`
	 const duration = moment.duration(client.uptime).format('M [Ay],  W [Hafta], D[G�n], H [Saat], m [Dakika]');    
		 const embed = new Discord.MessageEmbed()
		.setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
		.addField("Sunucu Say�s�", client.guilds.cache.size)
		.addField("�ye Say�s�", client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))
		.addField("Uptime S�resi", duration)
	    .addField(`� Ba�lant�lar �`, `� [[Davet Et]](${inviteUrl}) � [[Destek Sunucusu]](https://discord.gg/m6tRSMPDJPd) �`)
        .setFooter(client.user.username, client.user.avatarURL())
		.setDescription("Bot �uan Global Ortam ��in Kapal�d�r.")
		message.channel.send(embed)
	 } else if(command == "kontrol-et"){
      if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
	 if(!message.member.roles.cache.has(modRole)) return message.channel.send(embed.setDescription("�zg�n�m Bu Komutu Kullanabilmek Gerekli �zin Sende Bulunmuyor"))
	  let obj = await db.get(`serverData.${message.guild.id}.botsData`) || {}
	  let array1 = []
	  let array2 = []
	  let array3 = []
	  let veri = Object.keys(obj).forEach(botID => {
        if(obj[botID].status == "Onayl�" && !message.guild.members.cache.get(botID)){
		   array1.push({ID:botID})
		} else if(obj[botID].status == "Reddedildi" && message.guild.members.cache.get(botID)){
		    array2.push({ID:botID})
		} else if(obj[botID].status == "Beklemede" && message.guild.members.cache.get(botID)){
		   array3.push({ID:botID})
		}
	  })  // Soulfly Taraf�ndan Yap�lm��t�r.
	  let botEkle = (ID) => `https://discord.com/oauth2/authorize?client_id=${ID}&scope=bot&permissions=0` 
	 let map = (arr) => arr.map(data => `(**${data.ID}**) | [Bot Ekle (0)](${botEkle(data.ID)})`).slice(0, 5).join("\n")
	  let map2 = (arr) => arr.map(data => `<@${data.ID}>`).join(", ")
	    const embed = new Discord.MessageEmbed()
		.setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .addField("**Onayl� ve Ekli Olmayanlar**",  array1.length > 5 ? map(array1) + ".." : array1.length >= 1 ? map(array1) : "Liste Bo�") 
	    .addField("**Reddedilmi� ve Ekli Olanlar**",  array2.length > 5 ? map2(array2).slice(0, 5) + ".." : array2.length >= 1 ? map2(array2) :"Liste Bo�")
		.addField("**Beklemede ve Ekli Olanlar**",  array3.length > 5 ? map2(array3).slice(0, 5) + ".." : array3.length >= 1 ? map2(array3) :"Liste Bo�")
	    .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL())
		message.channel.send(embed)
	} else if(command == "bot-sil"){
        if(!addChannel ||  !logChannel || !modRole) return message.channel.send("Gerekli Ayarlamalar Yap�lmadan Bu Gibi Komutlar� Kullanamazs�n�z Yard�m Men�s�ne Bakmaya Nedersin?")
    	let botID = args[0]
	    const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
	    .setTimestamp()
        .setFooter(client.user.username, client.user.avatarURL())
		 if(!message.member.roles.cache.has(modRole)) return message.channel.send(embed.setDescription("�zg�n�m Bu Komutu Kullanabilmek Gerekli �zin Sende Bulunmuyor"))
		 if(!botID || isNaN(botID)) return message.channel.send(embed.setDescription("L�tfen Silmek �stedi�iniz Botun IDsini Yaz�n�z"));
		
		 let bot = db.fetch(`serverData.${message.guild.id}.botsData.${botID}`);
	     let discordBot = null;
         try {
	    	 discordBot = await client.users.fetch(botID);
	     }	catch {
            return message.channel.send(embed.setDescription("Discord Apide B�yle Bir Bot Bulamad�m."));
	     }	
		 
		 if(!bot) return message.channel.send(embed.setDescription(`Sistemde **${discordBot.username}** �simli Bot Bulamad�m.`))
    
      if(bot.status == "Onayl�") db.subtract(`serverData.${message.guild.id}.succSize`, 1)
	  if(bot.status == "Beklemede")  db.subtract(`serverData.${message.guild.id}.waitSize`, 1)
	  if(bot.status == "Reddedildi")  db.subtract(`serverData.${message.guild.id}.redSize`, 1)
    
       db.delete(`serverData.${message.guild.id}.botsData.${botID}`);
   //  message.react("727544033697595583") // SEN�N EMOJ� ID T�K EMOJ�S�
    return message.channel.send(embed.setDescription(`**${discordBot.username}** �simli Bot Sistemden Silindi.`)) 
     } else if(command == "ekle-kanal"){
     // Soulfly Taraf�ndan Yap�lm��t�r.
	 if(args[0] == "s�f�rla"){
		 if(!addChannel) return message.channel.send("Bot Ekleme Kanal� Zaten Ayarlanmam��!")
		 db.delete(`serverData.${message.guild.id}.addChannel`)
	     return message.channel.send("Bot Ekleme Kanal� S�f�rland�.")
	 }
	  	 let channels = message.mentions.channels.first();
	 if(!channels) return message.channel.send("Ayarlamak �stedi�iniz Kanal� Etiketleyiniz!")
	   db.set(`serverData.${message.guild.id}.addChannel`, channels.id)
	  return message.channel.send(`Bot Ekleme Kanal� Ba�ar�l� Bir �ekilde ${channels} Olarak Ayarland�.`)
  } else if(command == "log-channel"){

	 if(args[0] == "s�f�rla"){
		 if(!logChannel) return message.channel.send("Log Kanal� Zaten Ayarlanmam��!")
		 db.delete(`serverData.${message.guild.id}.logChannel`)
	     return message.channel.send("Log Kanal� Ba�ar�l� Bir �ekilde S�f�rland� S�f�rland�.")
	 }
	  let channels = message.mentions.channels.first();
	  if(!channels) return message.channel.send("Ayarlamak �stedi�iniz Kanal� Etiketleyiniz!")
	  db.set(`serverData.${message.guild.id}.logChannel`, channels.id)
	  return message.channel.send(`Bot Log Kanal� Ba�ar�l� Bir �ekilde ${channels} Olarak Ayarland�.`)
  } else if(command == "yetkili-rol"){

	 if(args[0] == "s�f�rla"){
		 if(!modRole) return message.channel.send("Yetkili Rol� Zaten Ayarlanmam��!")
		 db.delete(`serverData.${message.guild.id}.modRole`)
	     return message.channel.send("Yetkili Rol� Ba�ar�l� Bir �ekilde S�f�rland� S�f�rland�.")
	 }
	  let roles = message.mentions.roles.first();
	  if(!roles) return message.channel.send("Ayarlamak �stedi�iniz Rol� Etiketleyiniz!")
	   db.set(`serverData.${message.guild.id}.modRole`, roles.id)
	  return message.channel.send(`Yetkili Rol� Ba�ar�l� Bir �ekilde **${roles.name}** Olarak Ayarland�.`) 
  }
})


client.on('guildMemberRemove', async member => {
	member.guild.members.cache.filter(s => db.fetch(`serverData.${member.guild.id}.botsData.${s.id}`)).forEach(x => {
      let bot = db.fetch(`serverData.${member.guild.id}.botsData.${x.id}`);
	  if(bot){
	  if(bot.owner == member.id){
		 member.guild.members.cache.get(x.id).ban({reason: "Sahibi Sunucudan Ayr�ld�."})
		 db.set(`serverData.${member.guild.id}.botsData.${x.id}.status`, "Reddedildi")
		 db.set(`serverData.${member.guild.id}.botsData.${x.id}.redReason`, "Sahibi Sunucudan Ayr�ld�.")
	  }
    }
  })
})

client.login(settings.token)


