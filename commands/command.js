export const embedMessage = {
    name: 'embed',
    description: "Embed",
    execute(message,args,Discord) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#fffb00')
        .setTitle('Rules')
        .setDescription('This is embed for rules')
        .addFields(
            {name: 'Rule1', value: 'Test value'},
            {name: 'Rule2', value: 'Test value2'},
            {name: 'Rule3', value: 'Test value3'}

        )
        .setImage('https://media.istockphoto.com/photos/noir-movie-character-picture-id837345268?k=20&m=837345268&s=612x612&w=0&h=1tahuBSTIUCUbVcZhaxHMV5iLm-W1c_UBlz7VBAcNrc=')
        .setFooter('Footer test')

        message.channel.send(newEmbed);
    }
}

