const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

// temp variable holds new channel ID
 var channelID
 
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on("messageCreate", async (message) => {
    if(message.content.startsWith("!start")) {
        message.channel.send("Hello!");
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