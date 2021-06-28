const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token);

client.once('ready', () => {
    console.log('Ready!\n---');
    client.user.setActivity('risusiverse-thai.com/risus-bot');
});

client.on('message', message => {
    if (message.type !== 'DEFAULT') return;
    if (message.author.bot && message.author.id !== '850047136091340881') return;

    let emoji = false;
    if (message.channel.type === "dm" || message.guild.me.hasPermission('USE_EXTERNAL_EMOJIS'))
        emoji = true;

    let diceLIMIT = 0;
    let diceMode = 0;
    let rollcommmand = message.content;

    switch (message.content.charAt(0)) {
        case '*':
            if (message.content.charAt(1) === '!' || rollcommmand.charAt(1) === '$') {
                diceMode = 1;
                rollcommmand = rollcommmand.slice(1);
            } else {
                try {
                    diceLIMIT = parseInt(message.content.slice(1).split('!')[0]);
                    diceMode = 3;
                    rollcommmand = '!';
                } catch (e) {} finally {}
            }
            break;
        case '^':
            if (message.content.charAt(1) === '$') return;
            if (message.content.charAt(1) === '!') {
                diceMode = 2;
                rollcommmand = '!';
            } else {
                try {
                    diceLIMIT = parseInt(message.content.slice(1).split('!')[0]);
                    diceMode = 4;
                    rollcommmand = '!';
                } catch (e) {} finally {}
            }
            break;
        case 'a':
        case 'A':
            if (message.content.charAt(1) === '$') return;
            if (message.content.charAt(1) === '!') {
                diceMode = 5;
                rollcommmand = rollcommmand.slice(1);
            }
            break;
        case 'd':
        case 'D':
            if (message.content.charAt(1) === '$') return;
            if (message.content.charAt(1) === '!') {
                diceMode = 6;
                rollcommmand = rollcommmand.slice(1);
            }
            break;
        case 's':
            if (message.content.charAt(1) === '!' || rollcommmand.charAt(1) === '$') {
                diceMode = 7;
                rollcommmand = rollcommmand.slice(1);
            }
            break;
        case 'S':
            if (message.content.charAt(1) === '!') {
                diceMode = 7;
                rollcommmand = rollcommmand.slice(1);
            } else if (rollcommmand.charAt(1) === '$') {
                diceMode = 8;
                rollcommmand = rollcommmand.slice(1);
            }
            break;
        case 'r':
        case 'R':
            if (message.content.charAt(1) === '$') return;
            if (message.content.charAt(1) === '!') return;
            else {
                try {
                    diceLIMIT = parseInt(message.content.slice(1).split('!')[0]);
                    diceMode = 9;
                    rollcommmand = '!';
                } catch (e) {} finally {}
            }
            break;
    }

    if (rollcommmand.charAt(0) === '!')
        rollall(message, false, diceMode, emoji, diceLIMIT);
    else if (rollcommmand.charAt(0) === '$' && diceMode !== 2)
        rollall(message, true, diceMode, emoji, diceLIMIT);
    else if (message.content.startsWith('%')) {
        let total = 0,
            s = message.content.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
        while (s.length) {
            total += parseFloat(s.shift());
        }
        message.channel.send(total);
    }
});

//DICE CONTROL

function rollall(message, TEAMmode, DiceMode, emoji, diceLIMIT) {
    let OUTPUT = '';

    let cliches = message.content.split('\n');

    if (TEAMmode)
        cliches[0] = cliches[0].split('$')[1];
    else
        cliches[0] = cliches[0].split('!')[1];

    let TEAMscore6s = 0;
    let rolled = 0;

    let guild = '';
    let guil_id = '';
    if (message.channel.type !== "dm") {
        guild = ` - ${message.channel.name} - ${message.guild.name} `;
        guil_id = message.guild.id
    }

    cliches.forEach(cliche => {
        try {
            if (rolled >= 15) return;
            if (cliche.length < 1) return; // 1 <- 3 ''=1 '()'=3
            let dices = 0;
            let returnMsg;
            if (((cliche.indexOf('(') < 0) && (cliche.indexOf('[') < 0) && (cliche.indexOf('<') < 0) && (cliche.indexOf('{') < 0)) &&
                ((cliche.indexOf(')') < 0) && (cliche.indexOf(']') < 0) && (cliche.indexOf('>') < 0) && (cliche.indexOf('}')))) {
                /*dices = parseInt(cliche.split(' ')[0].split('+')[0].split('-')[0].replace(/[^0-9-]/g, ''));
                returnMsg = rollDice(dices, cliche, message, TEAMmode, TEAMscore6s, DiceMode, guil_id);
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

            if ((DiceMode === 4 || DiceMode === 2) && cliche.split(bracket)[1].split(bracket2)[0].indexOf('/') > -1)
                dices = parseInt(cliche.split(bracket)[1].split(bracket2)[0].split('/')[1].replace(/[^0-9-]/g, '')); //.split('+')[0].split('-')[0]
            else
                dices = parseInt(cliche.split(bracket)[1].split(bracket2)[0].split('/')[0].replace(/[^0-9-]/g, '')); //.split('+')[0].split('-')[0]
            returnMsg = rollDice(dices, cliche, message, TEAMmode, TEAMscore6s, DiceMode, bracket2, emoji, diceLIMIT);
            if (returnMsg.result === 'ERROR30') {
                OUTPUT += sendMsgUnder2000(`> *${cliche} - Could not roll more than 30 dices*`, OUTPUT);
                return;
            }
            switch (DiceMode) {
                case 1:
                    if (TEAMscore6s < returnMsg.TEAMscore6s)
                        TEAMscore6s = returnMsg.TEAMscore6s;
                    break;
                default:
                    TEAMscore6s += returnMsg.TEAMscore6s;
                    break;
            }
            switch (DiceMode) {
                case 9:
                    let text9;console.log(cliche.replace(/\W/g, ''));
                    if (dices > 1 || cliche.replace(/\W/g, '').replace(/\d/g,'') != '')
                        text9 = `> **${cliche}: ${returnMsg.eachdice}`;
                    else
                        text9 = `> **${returnMsg.eachdice}`;
                    if (returnMsg.result !== '')
                        text9 += ` :${returnMsg.result}**`;
                    else
                        text9 += `**`;
                    OUTPUT += sendMsgUnder2000(text9, OUTPUT);
                    break;
                default:
                    OUTPUT += sendMsgUnder2000(`> **${cliche}: ${returnMsg.eachdice} :${returnMsg.result}**`, OUTPUT); //false, message); //.split(bracket2)[0]}${bracket2
                    break;
            }
            rolled++;
        } catch (e) {} finally {}
    });
    if ( /*rolled === 0 && allText*/ OUTPUT === '') return;
    //else if (rolled === 0) return;

    let TEAMscore = '';
    if (TEAMmode && rolled > 1)
        switch (DiceMode) {
            case 0:
                TEAMscore = `> ***TEAM= ${TEAMscore6s/6}\\* =${TEAMscore6s}***`;
                break;
            case 1:
                TEAMscore = `> ***TEAM= ${DiceEmoji(TEAMscore6s, emoji)}***`;
                break;
            case 7:
            case 8:
                TEAMscore = `> ***TEAM=  ${TEAMscore6s}  ${Tick(emoji)}***`;
                break;
        }
    if (rolled >= 1)
        switch (DiceMode) {
            case 9:
                OUTPUT = `***<${diceLIMIT}>***\n` + OUTPUT;
                break;
        }

    OUTPUT += TEAMscore + '\n';

    try {
        message.channel.send(OUTPUT);
    } catch (e) {
        console.log(e);
    } finally {}
    console.log(OUTPUT);
    //sendMsgUnder2000(TEAMscore, true, message);

    console.log(`${message.author.username}${guild}\n${message.content}\n\--`);
}

function rollDice(dices, cliche, message, TEAMmode, TEAMscore6s, DiceMode, bracket2, emoji, diceLIMIT) {
    if (isNaN(dices)) return;

    if (DiceMode !== 2) {
        let total = 0,
            s = cliche.split(bracket2)[1].match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
        while (s.length) {
            total += parseFloat(s.shift());
        }
        dices += total;
    }
    /*if (cliche.split(bracket2)[1].indexOf('+') > -1)
        dices += parseInt(cliche.split('+')[1].replace(/[^0-9-]/g, ''));
    else if (cliche.split(bracket2)[1].indexOf('-') > -1)
        dices -= parseInt(cliche.split('-')[1].replace(/[^0-9-]/g, ''));*/



    let D = 6;

    let resultInt = 0;
    let returnMsg = {
        eachdice: '',
        result: '',
        TEAMscore6s: 0,
    }

    switch (DiceMode) {
        case 7:
        case 8:
            diceLIMIT = dices;
            break;
        case 5:
        case 6:
            diceLIMIT = dices;
            dices *= 2;
            break;
        case 9:
            D = diceLIMIT;
            break;
    }

    if (dices > 30) {
        returnMsg.result = 'ERROR30';
        return returnMsg;
    }

    let D56FLIP = false;

    let randomSequence = new Array(dices);
    for (let i = 0; i < dices; i++) {
        randomSequence[i] = Math.floor(Math.random() * D) + 1;
        switch (DiceMode) {
            case 7:
                if (randomSequence[i] === 6)
                    dices++;
        }
    }

    switch (DiceMode) {
        case 3:
            randomSequence.sort(function (a, b) {
                return b - a
            })
            break;
        case 5:
        case 6:
            let FirstSUM = 0;
            for (let i = 0; i < diceLIMIT; i++) {
                FirstSUM += randomSequence[i];
            }
            let SecondSUM = Math.abs(randomSequence.reduce((a, b) => a + b, 0) - FirstSUM);
            switch (DiceMode) {
                case 5:
                    if (!(FirstSUM > SecondSUM))
                        D56FLIP = true;
                    break;
                case 6:
                    if (!(FirstSUM < SecondSUM))
                        D56FLIP = true;
                    break;
            }
            break;
    }

    clicheLIMIT = diceLIMIT;
    for (let i = 0; i < dices; i++) {
        switch (DiceMode) {
            case 9:
                returnMsg.eachdice += `[${randomSequence[i]}]`;
                break;
            case 6:
            case 5: //ทอยสองกลุ่ม
                clicheLIMIT--;
                if (clicheLIMIT === -1)
                    returnMsg.eachdice += ' ';
                if ((clicheLIMIT > -1 && D56FLIP) || (clicheLIMIT <= -1 && !D56FLIP))
                    returnMsg.eachdice += GrayDiceEmoji(randomSequence[i], emoji);
                else if (DiceMode === 5) returnMsg.eachdice += GreenDiceEmoji(randomSequence[i], emoji);
                else returnMsg.eachdice += RedDiceEmoji(randomSequence[i], emoji);
                break;
            case 3: //นับจำนวนลูกแรกๆ
                if (clicheLIMIT > 0) {
                    returnMsg.eachdice += DiceEmoji(randomSequence[i], emoji);
                } else returnMsg.eachdice += GrayDiceEmoji(randomSequence[i], emoji);
                break;
            case 7:
            case 8:
                clicheLIMIT--;
                if (clicheLIMIT === -1)
                    returnMsg.eachdice += ' ';
                if (randomSequence[i] === 6 && DiceMode !== 8) {
                    returnMsg.eachdice += GreenDiceEmoji(randomSequence[i], emoji);
                    break;
                }
                if (TEAMmode && DiceMode !== 8) {
                    returnMsg.eachdice += GrayDiceEmoji(randomSequence[i], emoji);
                    break;
                }
                case 2: //เลขคู่
                    if ((randomSequence[i] % 2) === 0)
                        returnMsg.eachdice += DiceEmoji(randomSequence[i], emoji);
                    else
                        returnMsg.eachdice += GrayDiceEmoji(randomSequence[i], emoji);
                    break;
                case 0: //สีเทาเฉพาะถ้าเป็นทีมแล้วเลขไม่เป็น6 & mode^ไม่เป็นคู่
                    if (!TEAMmode || randomSequence[i] === 6)
                        returnMsg.eachdice += DiceEmoji(randomSequence[i], emoji);
                    else
                        returnMsg.eachdice += GrayDiceEmoji(randomSequence[i], emoji);
                    break;
                default: //จริงทั้งหมด
                    returnMsg.eachdice += DiceEmoji(randomSequence[i], emoji);
                    break;
        }

        switch (DiceMode) {
            case 6:
            case 5:
                if (clicheLIMIT > -1 && D56FLIP) break;
                if (clicheLIMIT <= -1 && !D56FLIP) break;
                resultInt += randomSequence[i];
                break;
            case 3:
                if (clicheLIMIT > 0) {
                    clicheLIMIT--;
                    resultInt += randomSequence[i];
                }
                break;
            case 1:
                if (resultInt < randomSequence[i])
                    resultInt = randomSequence[i];
                break;
            case 2:
                if ((randomSequence[i] % 2) !== 0)
                    resultInt = 1;
                break;
            case 7:
            case 8:
                if (TEAMmode && DiceMode !== 8) {
                    if (randomSequence[i] === 6)
                        resultInt++;
                    break;
                }
                if ((randomSequence[i] % 2) === 0)
                    resultInt++;
                break;
            default:
                if (TEAMmode)
                    if (randomSequence[i] !== 6) randomSequence[i] = 0;
                resultInt += randomSequence[i];
                break;
        }
    }
    switch (DiceMode) {
        case 1:
            returnMsg.result = ' ' + DiceEmoji(resultInt, emoji);
            if (returnMsg.TEAMscore6s < resultInt) {
                returnMsg.TEAMscore6s = resultInt;
            }
            break;
        case 2:
            if (resultInt === 0)
                returnMsg.result = '** ***Success!*';
            else
                returnMsg.result = ' fail';
            break;
        case 4:
            if (resultInt <= diceLIMIT)
                returnMsg.result = ` ${resultInt} ≤ ${diceLIMIT} :** ***Success!*`;
            else
                returnMsg.result = ` ${resultInt} ≤ ${diceLIMIT} : fail`;
            break;
        case 7:
        case 8:
            returnMsg.result = `  ${resultInt}  ${Tick(emoji)}`;
            returnMsg.TEAMscore6s = resultInt;
            break;
        case 9:
            if (dices > 1)
                returnMsg.result = resultInt;
            break;
        default:
            returnMsg.result = resultInt;
            returnMsg.TEAMscore6s = resultInt;
            break;
    }
    return returnMsg;
}

//var allText = '';

function sendMsgUnder2000(text, overalltext) { //final, ch) {
    const newtext = text + '\n';
    if ((newtext + overalltext).length > 1900)
        return '';
    else
        return newtext;
    /*
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
    */
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

function DiceEmoji(num, emoji) {
    if (!emoji) return NumEmoji(num);
    let id = '';
    switch (num) {
        case 1:
            id = '854776761618792488';
            break;
        case 2:
            id = '854777114955350027';
            break;
        case 3:
            id = '854777168713089094';
            break;
        case 4:
            id = '854777193204547605';
            break;
        case 5:
            id = '854777213810638849';
            break;
        case 6:
            id = '854777233906466816';
            break;
        default:
            id = '854776761618792488';
            break;
    }
    return `<:_:${id}>`;
}

function GrayDiceEmoji(num, emoji) {
    if (!emoji) return NumEmoji(num);
    let id = '';
    switch (num) {
        case 2:
            id = '850077840661020683';
            break;
        case 3:
            id = '850077840770990081';
            break;
        case 4:
            id = '850077840628252733';
            break;
        case 5:
            id = '850077841218732052';
            break;
        case 6:
            id = '850077841022648320';
            break;
        default:
            id = '850077841096835072';
            break;
    }
    return `<:_:${id}>`;
}

function GreenDiceEmoji(num, emoji) {
    if (!emoji) return NumEmoji(num);
    let id = '';
    switch (num) {
        case 6:
            id = '850076808715698220';
            break;
        case 5:
            id = '850077497437192212';
            break;
        case 4:
            id = '850077497147785246';
            break;
        case 3:
            id = '850077497337053284';
            break;
        case 2:
            id = '850077496933220362';
            break;
        default:
            id = '850077497169281024';
            break;
    }
    return `<:_:${id}>`;
}

function RedDiceEmoji(num, emoji) {
    if (!emoji) return NumEmoji(num);
    let id = '';
    switch (num) {
        case 6:
            id = '850074539600904202';
            break;
        case 5:
            id = '850075020129861692';
            break;
        case 4:
            id = '850075011996975124';
            break;
        case 3:
            id = '850075001096241173';
            break;
        case 2:
            id = '850074993114218556';
            break;
        default:
            id = '850074985326575616';
            break;
    }
    return `<:_:${id}>`;
}

function Tick(emoji) {
    if (!emoji) return '✓';
    return `<:_:853702038353739837>`;
}