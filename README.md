# Discord Avatar Bot

A Discord bot that allows you to easily manage your profile avatar, banner, and bio through simple commands.

[![Discord](https://img.shields.io/discord/1433690273870778410?color=7289DA&label=Discord&logo=discord&logoColor=white)](https://discord.gg/jeAyPqjH)

## Features

- Set profile avatar with a single command
- Update your profile banner
- Set both avatar and banner simultaneously
- Reset your profile to default
- Clean and colorful console interface
- Secure environment variable configuration

## Commands

- `!setprofile <avatar_url> <banner_url> [bio]` - Set your profile avatar, banner, and optional bio
- `!setavatar <image_url>` - Set your profile avatar
- `!setbanner <image_url>` - Set your profile banner
- `!resetprofile` - Reset your profile to default
- `!help` - Display the help menu

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/titanxdevz/discord-avatar-bot.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```env
   TOKEN=your_discord_bot_token_here
   PREFIX=!
   OWNER_ID=your_discord_user_id_here
   ```

4. Run the bot:
   ```bash
   node .
   ```

## Configuration

Before running the bot, make sure to set up your environment variables:

- `TOKEN`: Your Discord bot token (get it from the [Discord Developer Portal](https://discord.com/developers/applications))
- `PREFIX`: The command prefix (default: `!`)
- `OWNER_ID`: Your Discord user ID (for security purposes)

## Requirements

- Node.js v22.1.0 or higher
- Discord.js v14.x
- A Discord bot token

## Discord Server

Join our Discord server for support, updates, and community discussion:

[![Join our Discord](https://discordapp.com/api/guilds/1433690273870778410/widget.png?style=banner2)](https://discord.gg/jeAyPqjH)

## Made by

**Titan X Dev** - *Lead Developer*

**Bot Modifier By Titan** - *Contributor*