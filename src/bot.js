require('dotenv').config();
const { Client, GatewayIntentBits, REST } = require('discord.js');
const { handleSetAvatar } = require('./avatarHandler');
const { handleSetProfile, handleSetBanner, handleResetProfile } = require('./profileHandler');

// Clear console on start
console.clear();

// Color functions for console output
const colors = {
    blue: '\x1b[34m',
    skyBlue: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

// Gradient function for ASCII art
function printGradientAscii() {
    const asciiLines = [
        " /$$$$$$$$ /$$   /$$                               /$$   /$$       /$$$$$$$                      ",
        "|__  $$__/|__/  | $$                              | $$  / $$      | $$__  $$                     ",
        "   | $$    /$$ /$$$$$$    /$$$$$$  /$$$$$$$       |  $$/ $$/      | $$  \\ $$  /$$$$$$  /$$    /$$",
        "   | $$   | $$|_  $$_/   |____  $$| $$__  $$       \\  $$$$/       | $$  | $$ /$$__  $$|  $$  /$$/",
        "   | $$   | $$  | $$      /$$$$$$$| $$  \\ $$        >$$  $$       | $$  | $$| $$$$$$$$ \\  $$/$$/ ",
        "   | $$   | $$  | $$ /$$ /$$__  $$| $$  | $$       /$$/\\  $$      | $$  | $$| $$_____/  \\  $$$/  ",
        "   | $$   | $$  |  $$$$/|  $$$$$$$| $$  | $$      | $$  \\ $$      | $$$$$$$/|  $$$$$$$   \\  $/   ",
        "   |__/   |__/   \\___/   \\_______/|__/  |__/      |__/  |__/      |_______/  \\_______/    \\_/    "
    ];
    
    // Print each line with a gradient from blue to sky blue
    for (let i = 0; i < asciiLines.length; i++) {
        const ratio = i / (asciiLines.length - 1);
        const r = Math.floor(0 + ratio * (135 - 0));   // Blue to Sky Blue (R: 0 to 135)
        const g = Math.floor(150 + ratio * (206 - 150)); // Blue to Sky Blue (G: 150 to 206)
        const b = Math.floor(255 + ratio * (235 - 255)); // Blue to Sky Blue (B: 255 to 235)
        
        console.log(`\x1b[38;2;${r};${g};${b}m${asciiLines[i]}\x1b[0m`);
    }
}

// Print ASCII art only once at startup
printGradientAscii();
console.log(`${colors.blue}Setting up Discord client...${colors.reset}`);
console.log(`${colors.skyBlue}Initializing with Guild, Message, and Content intents...${colors.reset}`);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;
const rest = new REST({ version: '10' }).setToken(TOKEN);

console.log(`${colors.green}Token configured for API authentication${colors.reset}`);
console.log(`${colors.green}Command prefix set to:${colors.reset}`, PREFIX);

// Help menu function
function displayHelpMenu(message) {
    const helpEmbed = {
        color: 0x0099ff,
        title: 'Discord Avatar Bot - Help Menu',
        description: 'Here are all the available commands:',
        fields: [
            {
                name: 'Profile Commands',
                value: `\`${PREFIX}setprofile <avatar_url> <banner_url> [bio]\` - Set your profile avatar, banner, and bio\n` +
                       `\`${PREFIX}setavatar <image_url>\` - Set your profile avatar\n` +
                       `\`${PREFIX}setbanner <image_url>\` - Set your profile banner\n` +
                       `\`${PREFIX}resetprofile\` - Reset your profile to default`,
                inline: false
            },
            {
                name: 'Utility Commands',
                value: `\`${PREFIX}help\` - Display this help menu`,
                inline: false
            },
            {
                name: 'Notes',
                value: '• Only the bot owner can use these commands\n' +
                       '• Image URLs must be direct links to images\n' +
                       '• Bio is optional for the setprofile command',
                inline: false
            }
        ],
        footer: {
            text: 'Made by Titan X Dev | Bot Modifier By Titan'
        }
    };
    
    return message.channel.send({ embeds: [helpEmbed] });
}

client.once('ready', () => {
    // Don't reprint ASCII art here to avoid duplication
    console.log(`${colors.green}DISCORD BOT SUCCESSFULLY CONNECTED${colors.reset}`);
    console.log(`${colors.blue}Bot ID:${colors.reset}`, client.user.tag);
    console.log(`${colors.blue}Status:${colors.reset} Online and Ready`);
    console.log(`${colors.skyBlue}Made by Titan X Dev${colors.reset}`);
    console.log(`${colors.skyBlue}Bot Modifier By Titan${colors.reset}`);
    console.log('');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }
    
    if (!message.content.startsWith(PREFIX)) {
        return;
    }

    const OWNER_ID = process.env.OWNER_ID; 
    if (message.author.id !== OWNER_ID) {
        return message.reply('Only the bot owner can use this command!');
    }

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Removed console logging for commands to keep console clean
    switch (command) {
        case 'setprofile':
            await handleSetProfile(message, args, rest);
            break;
            
        case 'setavatar':
            await handleSetAvatar(message, args, rest);
            break;
            
        case 'setbanner':
            await handleSetBanner(message, args, rest);
            break;
            
        case 'resetprofile':
            await handleResetProfile(message, rest);
            break;
            
        case 'help':
            await displayHelpMenu(message);
            break;
            
        default:
            message.reply(`Unknown command. Available commands: !setprofile, !setavatar, !setbanner, !resetprofile, !help`);
    }
});

console.log(`${colors.green}Establishing connection to Discord API...${colors.reset}`);
client.login(TOKEN);