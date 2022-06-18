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
game.topNominations=[] //3 persons that are nominated for reveal
game.roomID=""; //game room
// nominations
game.nominationActive = false;
let nominations = {}
// botID = '987427488009433108' // Zane Bot
botID= '987373655715639316' //Mafia Bot

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
    /* ---------------------------- start nominations --------------------------- */
     if (message.content.startsWith("!nominate")){
        activateNominations(message)
     }
    //  vote for person ->  !n @name
     if (message.content.startsWith("!n ") && game.nominationActive){
        countVote(message)
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

/* -------------------------------------------------------------------------- */
/*                              channel functions                             */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                 nominations                                */
/* -------------------------------------------------------------------------- */

// activate nominations and set timer for it.
// at the end of voting collect the votes
const activateNominations =(message)=>{
    // clear nomination list
    game.topNominations = [];
    nominations = {}
    // open voting
    message.channel.sendTyping();
    message.channel.send("Voting has started. You have 30 seconds to vote!")
    message.channel.send("Vote -> !n @mention")
    game.nominationActive = true;
    // create timeout to stop voting
    setTimeout(()=>{
        if(game.nominationActive){
            game.nominationActive = false;
            message.channel.send("Votes recived. Stop Voting now.");
            collectVotes()
        }
    }, 20000)
}

// register vote with nomination
const countVote =(message)=>{
    if (!message.mentions.users) return
    nominations[message.author.id] = message.mentions.users.first().id
}
// filter out three top nominations
const collectVotes = ()=>{
    const nominated = Object.values(nominations)
    const topFilter = {}
    nominated.forEach(player => {
        if (player in topFilter){
            topFilter[player]  += 1
        }else{
            topFilter[player] =1
        }
    });
    // votes counted, select top 3
    const playerArray = Object.entries(topFilter)
    playerArray.sort(([key,value1],[key2,value2])=> value2-value1)
    playerArray.forEach((player, index) => {
        if (index >= 3 )return
        game.topNominations.push(player[0])
    });
    console.log("Top Three Selected: ",game.topNominations)
    /* ------------- top three selected, create final woting message ------------ */
}

// Login to Discord with your client's token
client.login(token);
