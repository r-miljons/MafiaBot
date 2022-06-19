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

/*
const exampleEmbed = new MessageEmbed()
  .setColor("#FFFF00")
  .setTitle("Mafia")
  .setDescription("Join the mafia game or something")
  .setThumbnail(
    "https://media.istockphoto.com/photos/noir-movie-character-picture-id837345268?k=20&m=837345268&s=612x612&w=0&h=1tahuBSTIUCUbVcZhaxHMV5iLm-W1c_UBlz7VBAcNrc="
  )
  .setTimestamp();

  */

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

const game = {};

game.lobbyOpen = false;
game.participants = [];
game.votingActive = false;
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

botID = "987373655715639316"; //Mafia Bot

client.on("messageCreate", (message) => {
  /* ----------------------------- start the game ----------------------------- */
  if (message.content.startsWith("!start") && game.lobbyOpen === false) {
    game.lobbyOpen = true;
    message.channel.send(
      /*{ embeds: [exampleEmbed]}*/ "Game Lobby open, react to this message to participate!"
    );
  }
  if (message.content.startsWith("!nominate") && game.nominationActive) {
     countVote(message);   
  }
  /* ------------------------------- open lobby ------------------------------- */
  if (
    message.author.id === botID &&
    message.content == "Game Lobby open, react to this message to participate!"
  ) {
    message.react("👏");

    const waitForFullLobby = setInterval(async () => {
      if (game.participants.length === 5) {
        message.channel.sendTyping();
        clearInterval(waitForFullLobby);
        game.lobbyOpen = false;
        assignRoles();
        sendRoles(message);
        message.channel.send(
          "Lobby Closed! Mafia has contacted you and the killer is on the run..."
        );

        // sends a message to the newly created channel
        game.roomID = await createNewChannel(message);
        const channel = getChannel()
        channel.send("Hello players!");
        startNight(message);
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
    }, 20000);
  }
});

const votingResults = {}


client.on("messageReactionAdd", (messageReaction, user) => {
  if (messageReaction.emoji.name == "👏" && user != "987373655715639316") {
    game.participants.push(user);
  }
});

// When night starts

const startNight = () => {
  // inform players
  const channel = getChannel()
  channel.send("The night has started, civilians can safely go to sleep...");
  // track messages
  let currentMessage = '';
  client.on("messageCreate", (message) => {
    currentMessage = message
  })
  
  console.log("This: ", currentMessage);
  let mafiaVoted = false;
  let doctorVoted = false;
  let detectiveVoted = false;

 // ids of players who got chosen
  let mafiaKilled;
  let doctorSaved;
  let detectiveRevealed;

  // each player gets sent a list of people to kill/save/reveal
  //console.log("Game participants: ",game.participants);
  let mafiaList = game.participants.filter(player => player != game.participantRoles.mafia);
  let doctorList = game.participants.filter(player => player != game.participantRoles.doctor);
  let detectiveList = game.participants.filter(player => player != game.participantRoles.detective);
  setTimeout(() => {
  game.participantRoles.mafia.send(`Who do you want to kill? 🔪 \n 1. ${mafiaList[0]} \n 2. ${mafiaList[1]} \n 3. ${mafiaList[2]} \n 4. ${mafiaList[3]} \n Reply with a number (1-4):`);
  game.participantRoles.doctor.send(`Who do you want to save? ❤️ \n 1. ${doctorList[0]} \n 2. ${doctorList[1]} \n 3. ${doctorList[2]} \n 4. ${doctorList[3]} \n Reply with a number (1-4):`);
  game.participantRoles.detective.send(`Who do you want to reveal? 👁️ \n 1. ${detectiveList[0]} \n 2. ${detectiveList[1]} \n 3. ${detectiveList[2]} \n 4. ${detectiveList[3]} \n Reply with a number (1-4):`);
  }, 100);

  //this interval checks who voted for whom
  const listenForAllVotes = setInterval(()=>{
    //console.log("Interval started");
    if(currentMessage.content == "1" || currentMessage.content == "2" || currentMessage.content == "3" || currentMessage.content == "4") {
      if(currentMessage.author == game.participantRoles.mafia) {
        mafiaKilled = mafiaList[Number(currentMessage.content)-1];
        mafiaVoted = true;
        //console.log("Mafia Voted: " + mafiaVoted);
      }
      if(currentMessage.author == game.participantRoles.doctor) {
        doctorSaved = doctorList[Number(currentMessage.content)-1];
        doctorVoted = true;
        //console.log("Mafia Voted: " + mafiaVoted);
      }
      if(currentMessage.author == game.participantRoles.detective) {
        detectiveRevealed = detectiveList[Number(currentMessage.content)-1];
        detectiveVoted = true;
        //console.log("Mafia Voted: " + mafiaVoted);
      }
    }
    if(mafiaVoted && doctorVoted && detectiveVoted) {
      clearInterval(listenForAllVotes);
      //send the detective role of the revealed player
      for (const [key, value] of Object.entries(game.participantRoles)) {
        if (Array.isArray(value)) {
          game.participantRoles.detective.send(`${detectiveRevealed} is: Civilian`);
        } else {
          if (value == detectiveRevealed) {
            game.participantRoles.detective.send(`${detectiveRevealed} is: ${key}`);
          }
        }
      }
      
      // calculate who is killed
      if (mafiaKilled == doctorSaved) {
          getChannel().send("Everyone survived the Night! 🎉 \n Type 🔪**!nominate**🔪 @player_name if you're suspicious. 🤔");
        // bot says everyone survived!
      } else {
        getChannel().send(`${mafiaKilled} got killed tonight! ☠️ \n Who could it be?... 🤔 \n Type 🔪**!nominate**🔪 @player_name if you're suspicious.`);
        // player that is eliminated: mafiaKilled;
      }

      // start the day
      setTimeout(() => {
        activateNominations();
      }, 1000);
    }
  },1);
}


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
  game.nominationActive = true;
  // create timeout to stop voting
  setTimeout(() => {
    if (game.nominationActive) {
      game.nominationActive = false;
      getChannel().send("Voting ended!");
      collectVotes();
    }
  }, 200000);
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
  const channel = getChannel()
  const playerArray = Object.entries(topFilter);
  playerArray.sort(([key, value1], [key2, value2]) => value2 - value1);
  for(let i=0; i < game.participants.length; i++) {
    if (game.participants[i].id == playerArray[0][0]) {
      channel.send(`${game.participants[i]} got eliminated! ☠️`);
      game.participants = game.participants.filter(player => player != game.participants[i]);
      startNight();
      break;
    }
  }

};

//assign roles to each participant
const assignRoles = () => {
  let clone = [...game.participants];
  const mafia =
    clone[Math.floor(Math.random() * clone.length)];
  game.participantRoles.mafia = mafia;
  clone = clone.filter((player) => player != mafia);
  const doctor =
    clone[Math.floor(Math.random() * clone.length)];
  game.participantRoles.doctor = doctor;
  clone = clone.filter((player) => player != doctor);
  const detective =
    clone[Math.floor(Math.random() * clone.length)];
  game.participantRoles.detective = detective;
  clone = clone.filter((player) => player != detective);
  const civilian =
    clone[Math.floor(Math.random() * clone.length)];
  game.participantRoles.civilians.push(civilian);
  clone = game.participants.filter((player) => player != civilian);
  game.participantRoles.civilians.push(clone[0]);
};

const sendRoles = (message) => {
  setTimeout(() => {
    // game.participants.forEach((participant) => {
    //   participant.DMChannel.delete().then(console.log).catch(console.error);
    // });
    message.channel.sendTyping();
    game.participantRoles.mafia.send("You are mafia! 👺");
    game.participantRoles.civilians.forEach((civilian) => {
      civilian.send("You are civilian 👤");
    });
    game.participantRoles.doctor.send("You are doctor 👨🏼‍⚕️");
    game.participantRoles.detective.send("You are detective 🕵🏼");
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
  return result.id;
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

const getChannel= ()=> {
  return  client.channels.cache
    .filter((channel) => {
      return channel.id === game.roomID;
    })
    .first();

}

// Login to Discord with your client's token
client.login(token);
