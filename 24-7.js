const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token_tester);
const Heroku = require('heroku-client');
const heroku = new Heroku({
    token: process.env.heroku_token
});
client.once('ready', () => {
    let filter = m => '766644729848528916' === '766644729848528916'
    let ch = client.channels.cache.get('857483980973932604');
    ch.send('!(1)').then(() => {
        ch.awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
            })
            .then(() => {
                ch.send('pass').then(() => client.destroy());
            })
            .catch(() => {
                heroku.delete('https://api.heroku.com/apps/discord-risus-bot/dynos').then(() => client.destroy());
            });
    });
});