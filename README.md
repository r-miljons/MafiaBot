# MafiaBot
A CodeX Hackathon project!

### Setup
* Clone the repo, install all packages:

`npm install`
* Create a config.json file, paste the code:

`{
  "token": "Your Discord bot token goes here"
}`
* Launch the bot:

`node index.js`

### Playing the game

* First a game lobby must be created in the text channel by typing:

`!start`

* When 5 people have joined the lobby, a new channel is created with all the participants.
* Bot DMs each player their role (Mafia, Doctor, Detective or civilian).
* Participants talk to each other with the goal of finding out who is the mafia
* 
