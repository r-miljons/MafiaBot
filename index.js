const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

let lobbyOpen = false;
let participants  = [];


client.on("messageCreate", (message) => {
    if(message.content.startsWith("!start") && lobbyOpen === false) {
        message.channel.sendTyping();
        lobbyOpen = true;
        message.channel.send("the embed thing goes here");  
    }
    if (message.author.id === '987373655715639316' && message.content === 'the embed thing goes here') {
        message.react('👏');
        setTimeout(() => {
            if(lobbyOpen === true) {
            message.channel.sendTyping();
            lobbyOpen = false;
            message.channel.send('Lobby closed, type !start to open a new Lobby');
            let mafia;
            function getMafia() {
                let mafiaID = Math.floor(Math.random() * participants.length);
                mafia = participants[mafiaID].id;
            }
            message.channel.send("The mafia is: " + mafia);
            }
        }, 10000);
    }
}) 


client.on("messageReactionAdd", (messageReaction, user ) => {
    if (messageReaction.emoji.name == '👏'&& user != '987373655715639316') {
        participants.push(user);
        console.log(participants[0].id);
    }
})


// Login to Discord with your client's token
client.login(token);