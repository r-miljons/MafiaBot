const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

let lobbyOpen = false;

client.on("messageCreate", (message) => {
    console.log(message.author.id);
    if(message.content.startsWith("!start") && lobbyOpen === false) {
        lobbyOpen = true;
        message.channel.send("the embed thing goes here");  
    }
    if (message.author.id === '987373655715639316' && message.content === 'the embed thing goes here') {
        message.react('👏');
        setTimeout(() => {
            if(lobbyOpen === true) {
            message.channel.send('Lobby closed, type !start to open a new Lobby');
            }
        }, 30000);
    }
}) 


//1st commit from Siva
//raimonds
// main

// Login to Discord with your client's token
client.login(token);