const { Client, Intents, MessageEmbed, MessageActionRow } = require("discord.js");
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
  civilians: [],
};
game.topNominations = []; //3 persons that are nominated for reveal
game.roomID = ""; //game room
// nominations
game.nominationActive = false;
let nominations = {};
var embedID
// botID = '987427488009433108' // 
//botID = "987373655715639316"; //Mafia Bot
botID = "987431184554393700"

const TEAM_SIZE = 1

const embedMessages = {}
const gameUsers = {}

client.on("messageCreate", async (message) => {
  /* ----------------------------- start the game ----------------------------- */
  if (message.content.startsWith("!start") && game.lobbyOpen === false) {
    game.lobbyOpen = true;

    const messageEmbed = await message.channel.send({ embeds: [exampleEmbed]})
    embedID = messageEmbed.id
    console.log(messageEmbed)

    embedMessages[embedID] = messageEmbed
  }
  console.log("Embed", embedID)
  console.log("Message", message.id)

  /* ------------------------------- open lobby ------------------------------- */
  if (
    message.author.id === botID && 
    message.id == embedID
  ) {
    message.react("👏");

    // const waitForFullLobby = setInterval(() => {
    //   if (game.participants.length === 5) {
    //     message.channel.sendTyping();
    //     // game.participants = [];
    //     clearInterval(waitForFullLobby);
    //     lobbyOpen = false;
    //     assignRoles();
    //     sendRoles(message);
    //     message.channel.send(
    //       "Lobby Closed! Game number (id) started successfully!\n A new game channel (id) has been created with all the participants"
    //     );
    //   }
    // }, 1);
    // setTimeout(() => {
    //   if (game.lobbyOpen === true && game.participants.length < 5) {
    //     message.channel.sendTyping();
    //     game.lobbyOpen = false;
    //     clearInterval(waitForFullLobby);
    //     message.channel.send(
    //       "Game not started, need 5 people to start the game.\n Type !start to open a new Lobby"
    //     );
    //   }
    // }, 20000);
  }
});

client.on('interactionCreate', interaction => {
  console.log('INTERACTION', interaction)
})

client.on("messageReactionAdd", (reaction, userId) => {
  const { emoji, message } = reaction

  if (emoji.name != "👏" || userId === 'botID') return

  let currentGameUsers = gameUsers[message.id]

  if (!currentGameUsers) {
    gameUsers[message.id] = [userId]
  } else {
    currentGameUsers.push(userId)
    gameUsers[message.id] = currentGameUsers
  }

  console.log(`Game ${message.id} users: ${gameUsers[message.id]}`)

  if (gameUsers[message.id].length === TEAM_SIZE) {
    message.channel.sendTyping();
    const playerRoles = assignRoles(gameUsers[message.id]);
    sendRoles(message, playerRoles);

    // Create channel here

    message.channel.send(
      `Lobby Closed! Game number ${message.id} started successfully!\n A new game channel (id) has been created with all the participants`
    );
  } else {
    // Log that room not full
  }
});

/* -------------------------------------------------------------------------- */
/*                                 nominations                                */
/* -------------------------------------------------------------------------- */

// activate nominations and set timer for it.
// at the end of voting collect the votes
const activateNominations = (message) => {
  // clear nomination list
  game.topNominations = [];
  nominations = {};
  // open voting
  message.channel.sendTyping();
  message.channel.send("Voting has started. You have 30 seconds to vote!");
  message.channel.send("Vote -> !n @mention");
  game.nominationActive = true;
  // create timeout to stop voting
  setTimeout(() => {
    if (game.nominationActive) {
      game.nominationActive = false;
      message.channel.send("Votes recived. Stop Voting now.");
      collectVotes();
    }
  }, 20000);
};

// register vote with nomination
const countVote = (message) => {
  if (!message.mentions.users) return;
  nominations[message.author.id] = message.mentions.users.first().id;
};
// filter out three top nominations
const collectVotes = () => {
  const nominated = Object.values(nominations);
  const topFilter = {};
  nominated.forEach((player) => {
    if (player in topFilter) {
      topFilter[player] += 1;
    } else {
      topFilter[player] = 1;
    }
  });
  // votes counted, select top 3
  const playerArray = Object.entries(topFilter);
  playerArray.sort(([key, value1], [key2, value2]) => value2 - value1);
  playerArray.forEach((player, index) => {
    if (index >= 3) return;
    game.topNominations.push(player[0]);
  });
  console.log("Top Three Selected: ", game.topNominations);
  /* ------------- top three selected, create final woting message ------------ */
};

//assign roles to each participant
const assignRoles = (players) => {
  let participantRoles = {
    mafia: "",
    doctor: "",
    detective: "",
    civilians: [],
  }

  const mafia =
    players[Math.floor(Math.random() * players.length)];
  participantRoles.mafia = mafia;
  players = players.filter((player) => player != mafia);
  const doctor =
    players[Math.floor(Math.random() * players.length)];
  participantRoles.doctor = doctor;
  players = players.filter((player) => player != doctor);
  const detective =
    players[Math.floor(Math.random() * players.length)];
  participantRoles.detective = detective;
  players = players.filter((player) => player != detective);
  const civilian =
    players[Math.floor(Math.random() * players.length)];
  participantRoles.civilians.push(civilian);
  players = players.filter((player) => player != civilian);
  participantRoles.civilians.push(players[0]);

  return participantRoles
};

const sendRoles = (message, roles) => {
  setTimeout(() => {
    // game.participants.forEach((participant) => {
    //   participant.DMChannel.delete().then(console.log).catch(console.error);
    // });
    message.channel.sendTyping();
    roles.mafia.send("You are mafia! 👺");
    roles.civilians.forEach((civilian) => {
      civilian.send("You are civilian 👤");
    });
    // & checks if promise isn't undefined
    roles.doctor.send("You are doctor 👨🏼‍⚕️");
    roles.detective.send("You are detective 🕵🏼");
    message.channel.send("New room created, go to your room!");
    createNewChannel(message);
  }, 2000);
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