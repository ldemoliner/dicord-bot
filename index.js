const Discord = require('discord.js')
const YTDL = require('ytdl-core') 

const TOKEN = 'NDY3ODg4MjAxMjk0Njc2MDAw.Di1ckQ.DhWzQC6WuO7GoEAceks_gS_ulV8'
const PREFIX = '.' 

function play(connection, message){
    var server = servers[message.guild.id]

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter:'audioonly'}))
    server.queue.shift()
    server.dispatcher.on('end', function(){
        if(server.queue[0]) play(connection, message)
        else connection.disconnect()
    })
}
var respostas = [
    "Sim",
    "Não",
    "Talvez",
    "Vai se fuder"
]

const bot = new Discord.Client()
var servers = {}

bot.on('ready', function() {
    console.log('Ta rodando, brother!')
})

bot.on("message", function(message){
    if(message.author.equals(bot.user)) return

    if(!message.content.startsWith(PREFIX)) return

    var args = message.content.substring(PREFIX.length).split(" ")

    switch(args[0].toLowerCase()) {
        case "ping":
            message.channel.send("Pong!")
            break

        case "8ball":
            if(args[1]){
                message.channel.send(respostas[Math.floor(Math.random() * respostas.length)])
            } else {
                message.channel.send("Escreve direito seu bosta")
            }
            break
        
        case "perfil":
            var embed =new Discord.RichEmbed()
            .addField(message.author.username, "")
            .setThumbnail(message.author.avatarURL)
            message.channel.send(embed)
            break
        
        case "play":
            if(!args[1]){
                message.channel.sendMessage("Precisa do link porra!")
                return
            }
            if(!message.member.voiceChannel){
                message.channel.send("Entra num chat de voz cuzão")
                return
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id]

            server.queue.push(args[1])

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message)
            })
            break

        case "skip":
            var server = servers[message.guild.id]
            if(server.dispatcher) server.dispatcher.end()
            break

        case "stop":
            var server = servers[message.guild.id]
            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect()
            break
        default:
            message.channel.send("Comando inválido")       
    }
})

bot.login(TOKEN)