# MafiaBot

A CodeX Hackathon project!

Bored on your server? Take a break to play one of the most famous games right on Discord!

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
- When night begins Mafia decides who to kill, and users get notification who was killed.
- Doctor can choose one player to be saved during the night, and detective can reveal a role of a choosen player.
- Players get to vote for who, in their opinion, could be mafia by typing `!nominate @player_name`.
- Player with the most votes gets eliminated.
- Participants talk to each other with the goal of finding out who is the mafia.
- Game goes on untill mafia is eliminated or untill mafia manages to kill all the civilians.

Have fun and good luck!
