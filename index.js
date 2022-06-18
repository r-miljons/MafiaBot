const { Client, Intents , MessageEmbed} = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });


const exampleEmbed = new MessageEmbed()
	.setColor('#FFFF00')
	.setTitle('Mafia')
	.setDescription('Join the mafia game or something')
	.setThumbnail('https://media.istockphoto.com/photos/noir-movie-character-picture-id837345268?k=20&m=837345268&s=612x612&w=0&h=1tahuBSTIUCUbVcZhaxHMV5iLm-W1c_UBlz7VBAcNrc=') 
	.setTimestamp();


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

const game = {};

game.lobbyOpen = false;
game.participants = [];
game.participantRoles = {
    mafia: "",
    doctor: "",
    detective: "",
    civilian: ""
}
game.roomID="";
botID = '987427488009433108' // Zane Bot
// botID= '987373655715639316' //Mafia Bot

client.on("messageCreate", (message) => {
    /* ----------------------------- start the game ----------------------------- */
    if(message.content.startsWith("!start") && game.lobbyOpen === false) {
        game.lobbyOpen = true;
        message.channel.send(/*{ embeds: [exampleEmbed]}*/"Game Lobby open, react to this message to participate!");
        
    }
    /* ------------------------------- open lobby ------------------------------- */
    if (message.author.id === botID && message.content == "Game Lobby open, react to this message to participate!") {
        message.react('👏');
        activateLobby(message);
    }

});
 

client.on("messageReactionAdd", (messageReaction, user ) => {
    if (messageReaction.emoji.name == '👏'&& user != '987373655715639316') {
        game.participants.push(user);
        console.log(game.participants[0].id);
    }

})

const activateLobby= (message)=>{
    setTimeout(() => {
        if(game.lobbyOpen === true) {
        message.channel.sendTyping();
        game.lobbyOpen = false;
        message.channel.send('Lobby closed, type !start to open a new Lobby');
        let mafia = game.participants[Math.floor(Math.random() * game.participants.length)];
        game.participantRoles.mafia = mafia;
        message.channel.send("The mafia is: " + mafia);
        message.channel.send("New room created, go to your room!");
        createNewChannel(message)
        }
    }, 10000);
}
    

// create new channel and return its id
const createNewChannel = async (message)=>{
    let result = await message.guild.channels.create('Dark Corner',{
        type: "GUILD_TEXT",
         permissionOverwrites: [{
            id: message.guild.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        }]
    })
    game.roomID=result.id
}
//  delete channel by id 
const deleteChannel =  (id)=>{
    const channel = client.channels.cache.filter((channel) => {
        return channel.id === id
      }).first()
      channel.delete()
}



// Login to Discord with your client's token
client.login(token);