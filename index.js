const { Client, Intents , MessageEmbed} = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });
const mafiaImg = 'https://media.istockphoto.com/photos/noir-movie-character-picture-id837345268?k=20&m=837345268&s=612x612&w=0&h=1tahuBSTIUCUbVcZhaxHMV5iLm-W1c_UBlz7VBAcNrc=';
const exampleEmbed = new MessageEmbed()
	.setColor('#FFFF00')
	.setTitle('Mafia')
	.setURL('https://discord.js.org/')
	.setDescription('Join the mafia game or something')
	.setThumbnail(mafiaImg)
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setTimestamp();

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

let lobbyOpen = false;

client.on("messageCreate", (message) => {
    console.log(message.author.id);
    if(message.content.startsWith("!start") && lobbyOpen === false) {
        lobbyOpen = true;
        message.channel.send({ embeds: [exampleEmbed]});  
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