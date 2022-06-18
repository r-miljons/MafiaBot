const { Client, Intents, MessageEmbed } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
  ],
});

const exampleEmbed = new MessageEmbed()
  .setColor("#FFFF00")
  .setTitle("Mafia")
  .setDescription("Join the mafia game or something")
  .setThumbnail(
    "https://media.istockphoto.com/photos/noir-movie-character-picture-id837345268?k=20&m=837345268&s=612x612&w=0&h=1tahuBSTIUCUbVcZhaxHMV5iLm-W1c_UBlz7VBAcNrc="
  )
  .setTimestamp();

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
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
botID = "987373655715639316"; //Mafia Bot

client.on("messageCreate", (message) => {
  /* ----------------------------- start the game ----------------------------- */
  if (message.content.startsWith("!start") && game.lobbyOpen === false) {
    game.lobbyOpen = true;
    message.channel.send(
      /*{ embeds: [exampleEmbed]}*/ "Game Lobby open, react to this message to participate!"
    );
  }
  /* ------------------------------- open lobby ------------------------------- */
  if (
    message.author.id === botID &&
    message.content == "Game Lobby open, react to this message to participate!"
  ) {
    message.react("👏");

    const waitForFullLobby = setInterval(() => {
      if (game.participants.length === 5) {
        message.channel.sendTyping();
        clearInterval(waitForFullLobby);
        lobbyOpen = false;
        assignRoles();
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
        message.channel.send(
          "Lobby Closed! Game number (id) started successfully!\n A new game channel (id) has been created with all the participants"
        );
      }
    }, 1);
    setTimeout(() => {
      if (game.lobbyOpen === true && game.participants.length < 5) {
        message.channel.sendTyping();
        game.lobbyOpen = false;
        clearInterval(waitForFullLobby);
        message.channel.send(
          "Game not started, need 5 people to start the game.\n Type !start to open a new Lobby"
        );
      }
    }, 10000);
}
  }
});

client.on("messageReactionAdd", (messageReaction, user) => {
  if (messageReaction.emoji.name == "👏" && user != "987373655715639316") {
    game.participants.push(user);
  }
});


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

//assign roles to each participant
const assignRoles = () => {
  const mafia =
    game.participants[Math.floor(Math.random() * game.participants.length)];
  game.participantRoles.mafia = mafia;
  game.participants = game.participants.filter((player) => player != mafia);
  const doctor =
    game.participants[Math.floor(Math.random() * game.participants.length)];
  game.participantRoles.doctor = doctor;
  game.participants = game.participants.filter((player) => player != doctor);
  const detective =
    game.participants[Math.floor(Math.random() * game.participants.length)];
  game.participantRoles.detective = detective;
  game.participants = game.participants.filter((player) => player != detective);
  const civilian =
    game.participants[Math.floor(Math.random() * game.participants.length)];
  game.participantRoles.civilians.push(civilian);
  game.participants = game.participants.filter((player) => player != civilian);
  game.participantRoles.civilians.push(game.participants[0]);
};

const activateLobby = (message) => {
  setTimeout(() => {
    if (game.lobbyOpen === true) {
      message.channel.sendTyping();
      game.lobbyOpen = false;
      message.channel.send("Lobby closed, type !start to open a new Lobby");
      message.channel.send("The mafia is: " + mafia);
      game.participantRoles.mafia.send("You are mafia! 👺");
      game.participantRoles.civilians.forEach((civilian) => {
        civilian.send("You are civilian 👤");
      });
      game.participantRoles.doctor.send("You are doctor 👨🏼‍⚕️");
      game.participantRoles.detective.send("You are detective 🕵🏼");
      message.channel.send("New room created, go to your room!");
      createNewChannel(message);
    }
  }, 15000);
};

// create new channel and return its id
const createNewChannel = async (message) => {
  let result = await message.guild.channels.create("Dark Corner", {
    type: "GUILD_TEXT",
    permissionOverwrites: [
      {
        id: message.guild.id,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
      },
    ],
  });
  game.roomID = result.id;
};
//  delete channel by id
const deleteChannel = (id) => {
  const channel = client.channels.cache
    .filter((channel) => {
      return channel.id === id;
    })
    .first();
  channel.delete();
};

// Login to Discord with your client's token
client.login(token);
