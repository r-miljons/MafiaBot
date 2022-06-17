const { Client, Intents , MessageEmbed} = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"] });

const mafiaImg = 'https://media.istockphoto.com/photos/noir-movie-character-picture-id837345268?k=20&m=837345268&s=612x612&w=0&h=1tahuBSTIUCUbVcZhaxHMV5iLm-W1c_UBlz7VBAcNrc=';
const exampleEmbed = new MessageEmbed()
	.setColor('#FFFF00')
	.setTitle('Mafia')
	.setDescription('Join the mafia game or something')
	.setThumbnail(mafiaImg)
	//.addFields(
	//	{ name: 'Regular field title', value: 'Some value here' },
	//	{ name: '\u200B', value: '\u200B' },
	//	{ name: 'Inline field title', value: 'Some value here', inline: true },
	//	{ name: 'Inline field title', value: 'Some value here', inline: true },
	//)
	.setTimestamp();

// temp variable holds new channel ID
 var channelID
 
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


client.on("messageCreate", (message) => {
    console.log(message.author.id);
    if(message.content.startsWith("!start") && lobbyOpen === false) {

        lobbyOpen = true;
        message.channel.send({ embeds: [exampleEmbed]});  
       
    }
    if (message.author.id === '987373655715639316' && message.content === '{ embeds: [exampleEmbed]} ) {
        message.react('👏');
        setTimeout(() => {
            if(lobbyOpen === true) {
            message.channel.sendTyping();
            lobbyOpen = false;
            message.channel.send('Lobby closed, type !start to open a new Lobby');
            message.channel.send("Current participants: " + participants.join(''));
            }
        }, 10000);
    }
}) 


client.on("messageReactionAdd", (messageReaction, user ) => {
    if (messageReaction.emoji.name == '👏'&& user != '987373655715639316') {
        participants.push(user);
        console.log('someone reacted');
    }
    // temp command for creating new channel
    if(message.content.startsWith("!channel")) {
        channelID = await createNewChannel(message)
    }
    // temp command for deleteing channel
    if(message.content.startsWith("!delete")){
        deleteChannel(channelID)
    }
}) 

// create new channel and return its id
const createNewChannel = async (message)=>{
    let result = await message.guild.channels.create('Dark Corner',{
        type: "GUILD_TEXT",
         permissionOverwrites: [{
            id: message.guild.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        }]
    })
    return result.id
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