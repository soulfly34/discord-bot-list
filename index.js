
/*
  # Discord Bot List Botu
  # Soulfly Tarafından Yapılmıştır.
  # Ayrıca Kod Sunucurında Benden İzinsiz Paylaşılması Yasaktır.
  # MIT Lisance ile Korunmaktador.
  # Support: https://discord.gg/9HcSgc8CWJ
*/


const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }, disableMentions: 'everyone'});
const db = require('quick.db');


client.commands = new Map();
 
 fs.readdir('./commands', (err, files) => {
   files.forEach(file => {
	 if(file.endsWith(".js")){
	  var command = require(`./commands/${file}`);
	  console.log(command.name)
	   client.commands.set(command.name, command)
	 }
   })	
   console.log("Komutlar Yüklendi.")   
 })
 
client.settings = {
    prefix: "!",
    token: "",
    addChannel: "801105324953436215",
    logChannel :"801105325436043324",
    modRole: "801105324522209301",	
    processChannel: "801105325436043325",
    emoji: "☑️",
    devRole: "801105324513558534"
 }
 
client.on('ready', () => {
	client.user.setStatus('online');
    client.user.setActivity(`?? Soulfly | ${client.settings.prefix}yardim`, {type: "PLAYING"});
    console.log("Başarılı Bir Şekilde Aktif Oldum.")
})

client.on('message', async message => {
	if(message.author.bot || !message.guild) return;
	let prefix = client.settings.prefix;
    if(message.channel.id == (client.settings.addChannel || null)) message.delete({timeout: 3000})
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ /g)
	var argCommand = args.shift().toLowerCase()

    const command = client.commands.get(argCommand);

    if(command){
      if(!client.settings.addChannel || !client.settings.logChannel || !client.settings.modRole || !client.settings.processChannel || !client.settings.emoji || !client.settings.devRole){
		return message.channel.send(`Bot Kullanabilmek Tüm Ayarlar Yapılması Gerekli.`)
	  }
	  command.run(client, message, args)
	}
})

client.on('guildMemberRemove', async member => {
	member.guild.members.cache.filter(s => db.fetch(`serverData.${member.guild.id}.botsData.${s.id}`)).forEach(x => {
      let bot = db.fetch(`serverData.${member.guild.id}.botsData.${x.id}`);
	  if(bot){
	  if(bot.owner == member.id){
             member.guild.members.ban(x, {reason: "Sahibi Sunucudan Ayrıldı."})
	     db.set(`serverData.${member.guild.id}.botsData.${x.id}.status`, "Reddedildi")
	     db.set(`serverData.${member.guild.id}.botsData.${x.id}.redReason`, "Sahibi Sunucudan Ayrıldı.")
	  }
    }
  })
})

client.login(client.settings.token)
