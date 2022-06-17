const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on("messageCreate", (message) => {
    if(message.content.startsWith("!start")) {
        message.channel.send("Hello!");
    }
})
//1st commit from Siva


// Login to Discord with your client's token
client.login(token);