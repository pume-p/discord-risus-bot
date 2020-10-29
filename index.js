const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token);

client.once('ready', () => {
    console.log('Ready!\n---');
    client.user.setActivity('risusiverse-thai.com/risus-bot');
});
//! this code was orignally made for a single large server and is very very very old code 
client.on('message', message => {
    if (message.type !== 'DEFAULT') return;
    if (message.author.bot) return;

    let diceMode = 0;
    let rollcommmand = message.content;
    if (message.content.charAt(0) === '*') {
        diceMode = 1;
        rollcommmand = rollcommmand.slice(1);
    } else if (message.content.charAt(0) === '^') {
        diceMode = 2;
        rollcommmand = rollcommmand.slice(1);
    }

    if (rollcommmand.charAt(0) === '!')
        rollall(message, false, diceMode);
    else if (rollcommmand.charAt(0) === '$' && diceMode !== 2)
        rollall(message, true, diceMode);
    else if (message.content.startsWith('%$')) {
        let total = 0,
            s = message.content.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
        while (s.length) {
            total += parseFloat(s.shift());
        }
        message.channel.send(total);
    }
})

//DICE CONTROL

function rollall(message, TEAMmode, DiceMode) {
    let cliches = message.content.split('\n');
    if (DiceMode !== 0)
        cliches[0] = cliches[0].slice(2);
    else cliches[0] = cliches[0].slice(1);
    let TEAMscore6s = 0;
    let rolled = 0;
    cliches.forEach(cliche => {
        try {
            if (rolled >= 15) return;
            if (cliche.length < 1) return; // 1 <- 3 ''=1 '()'=3
            let dices = 0;
            let returnMsg;
            if (((cliche.indexOf('(') < 0) && (cliche.indexOf('[') < 0) && (cliche.indexOf('<') < 0) && (cliche.indexOf('{') < 0)) &&
                ((cliche.indexOf(')') < 0) && (cliche.indexOf(']') < 0) && (cliche.indexOf('>') < 0) && (cliche.indexOf('}')))) {
                /*dices = parseInt(cliche.split(' ')[0].split('+')[0].split('-')[0].replace(/[^0-9-]/g, ''));
                returnMsg = rollDice(dices, cliche, message, TEAMmode, TEAMscore6s, DiceMode);
                TEAMscore6s = returnMsg.TEAMscore6s;
                sendMsgUnder2000(`> **${returnMsg.eachdice} :${returnMsg.result}**`, false, message);
                rolled++;*/
                return;
            }
            let bracket = '(';
            let bracket2 = ')';
            if (cliche.indexOf('(') < 0) {
                if (cliche.indexOf('[') > -1) bracket = '[';
                else if (cliche.indexOf('<') > -1) bracket = '<';
                else if (cliche.indexOf('{') > -1) bracket = '{';
            }
            if (cliche.indexOf(')') < 0) {
                if (cliche.indexOf(']') > -1) bracket2 = ']';
                else if (cliche.indexOf('>') > -1) bracket2 = '>';
                else if (cliche.indexOf('}') > -1) bracket2 = '}';
            }
            dices = parseInt(cliche.split(bracket)[1].split(bracket2)[0].split('/')[0].split('+')[0].split('-')[0].replace(/[^0-9-]/g, ''));
            returnMsg = rollDice(dices, cliche, message, TEAMmode, TEAMscore6s, DiceMode, bracket2);
            TEAMscore6s = returnMsg.TEAMscore6s;
            let guil_id = '';
            if (message.channel.type !== "dm") {
                guil_id = message.guild.id
            }
            if (guil_id === '685745431107338271')
                sendMsgUnder2000(`> **${cliche.split(bracket2)[0]}${bracket2}: ${returnMsg.eachdice} :${returnMsg.result}**`, false, message);
            else
                sendMsgUnder2000(`> **${cliche.split(bracket2)[0]}${bracket2}:  ${returnMsg.eachdice} :${returnMsg.result}**`, false, message);
            rolled++;
        } catch (e) {} finally {}
    });
    if (rolled === 0) return;

    let guild = '';
    let guil_id = '';
    if (message.channel.type !== "dm") {
        guild = ` - ${message.channel.name} - ${message.guild.name} `;
        guil_id = message.guild.id
    }

    let TEAMscore = '';
    if (TEAMmode && rolled > 1)
        if (DiceMode === 0)
            TEAMscore = `> ***TEAM= ${TEAMscore6s}\\* =${TEAMscore6s * 6}***`;
        else
            TEAMscore = `> ***TEAM= ${DiceEmoji(TEAMscore6s, guil_id)}***`;
    sendMsgUnder2000(TEAMscore, true, message);

    console.log(`${message.author.username}${guild}\n${message.content}\n\--`);
}

function rollDice(dices, cliche, message, TEAMmode, TEAMscore6s, DiceMode, bracket2) {
    if (isNaN(dices)) return;

    if (cliche.split(bracket2)[1].indexOf('+') > -1)
        dices += parseInt(cliche.split('+')[1].replace(/[^0-9-]/g, ''));
    else if (cliche.split(bracket2)[1].indexOf('-') > -1)
        dices -= parseInt(cliche.split('-')[1].replace(/[^0-9-]/g, ''));

    if (dices > 30) {
        sendMsgUnder2000(`> *${cliche} - Could not roll more than 30 dices*`, false, message);
        return;
    }
    let resultInt = 0;
    let returnMsg = {
        eachdice: '',
        result: '',
        TEAMscore6s: TEAMscore6s,
    }
    for (let i = 0; i < dices; i++) {
        let random = Math.floor(Math.random() * 6) + 1;
        if ((!TEAMmode || random === 6 || DiceMode === 1) && (DiceMode !== 2 || (random % 2) === 0)) //สีเทาเฉพาะถ้าเป็นทีมแล้วเลขไม่เป็น6 & mode^ไม่เป็นคู่
            returnMsg.eachdice += DiceEmoji(random, message.guild.id);
        else
            returnMsg.eachdice += GrayDiceEmoji(random, message.guild.id);

        switch (DiceMode) {
            case 0:
                if (TEAMmode)
                    if (random === 6) returnMsg.TEAMscore6s++;
                    else random = 0;
                resultInt += random;
                break;
            case 1:
                if (resultInt < random)
                    resultInt = random;
                break;
            case 2:
                if ((random % 2) !== 0)
                    resultInt = 1;
        }
    }
    switch (DiceMode) {
        case 0:
            returnMsg.result = resultInt;
            break;
        case 1:
            returnMsg.result = ' ' + DiceEmoji(resultInt, message.guild.id);
            if (returnMsg.TEAMscore6s < resultInt)
                returnMsg.TEAMscore6s = resultInt;
            break;
        case 2:
            if (resultInt === 0)
                returnMsg.result = '** ***Success!*';
            else
                returnMsg.result = ' fail';
    }
    return returnMsg;
}

var allText = '';

function sendMsgUnder2000(text, final, ch) {
    if (allText.length + text.length >= 2000 || final) {
        if (final) {
            if (allText.length + text.length >= 2000) {
                ch.channel.send(allText);
                allText = '';
            }
            allText += text + '\n'
        }
        ch.channel.send(allText);
        console.log(allText);
        allText = '';
    }
    if (!final) allText += text + '\n';
}

function DiceEmoji(num, g) {
    if (g !== '685745431107338271') return NumEmoji(num);
    let id = '';
    switch (num) {
        case 1:
            id = '726851299152232515';
            break;
        case 2:
            id = '726851357784408207';
            break;
        case 3:
            id = '726851383789355028';
            break;
        case 4:
            id = '726851415179395132';
            break;
        case 5:
            id = '726851433693184042';
            break;
        case 6:
            id = '726851451019722882';
            break;
        default:
            id = '726851299152232515';
            break;
    }
    return `<:d${num}:${id}>`;
}

function GrayDiceEmoji(num, g) {
    if (g !== '685745431107338271') return NumEmoji(num);
    let id = '';
    switch (num) {
        case 2:
            id = '760313662707335178';
            break;
        case 3:
            id = '760313684815380480';
            break;
        case 4:
            id = '760313708424855562';
            break;
        case 5:
            id = '760313730688352306';
            break;
        case 6:
            id = '760313749763915808';
            break;
        default:
            id = '760313638807404566';
            break;
    }
    return `<:g${num}:${id}>`;
}

function NumEmoji(num) {
    switch (num) {
        case 2:
            return '2️⃣ ';
        case 3:
            return '3️⃣ ';
        case 4:
            return '4️⃣ ';
        case 5:
            return '5️⃣ ';
        case 6:
            return '6️⃣ ';
        default:
            return '1️⃣ ';
    }
}