const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token_tester);

client.once('ready', () => {
    let filter = m => m.author.id === message.author.id
    client.channels.cache.get('857483980973932604').send('!(1)').then(() => {
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
        .then(message => {
            client.channels.cache.get('857483980973932604').send('pass');
        })
        .catch(collected => {
            request.delete(
                {
                    url: 'https://api.heroku.com/apps/discord-risus-bot/dynos',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.heroku+json; version=3',
                        'Authorization': 'Bearer ' + process.env.heroku_token
                    }
                },
                function(error, response, body) {
                    // Do stuff
                }
            );
        });
    })

});