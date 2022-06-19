# MafiaBot

A CodeX Hackathon project!

Bored on your server? Take a break to play one of the most famous party game right on Discord!

### Setup

- Clone the repo, install all packages:

`npm install`

- Create a config.json file, paste the code:

`{ "token": "Your Discord bot token goes here" }`

- Launch the bot:

`node index.js`

### Playing the game

- First a game lobby must be created in the text channel by typing:

`!start`

- When 5 people have joined the lobby, a new channel is created with all the participants.
- Bot DMs each player their role (Mafia, Doctor, Detective or civilian).
- When the Night begins Players get asked who do they want to: Mafia - kill, Doctor - save, Detective - reveal.
- Night ends and the bot annouces if someone got killed tonight.
- During the day Players talk to each other with the goal of finding out who is the mafia.
- Players get to vote for who they think could be the mafia by typing:

`!nominate @player_name`.

- Player with the most nominations gets eliminated and the night begins.
- Games ends when a mafia is killed or everyone is killed by the mafia.

