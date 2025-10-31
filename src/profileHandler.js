const { REST, Routes } = require('discord.js');
const https = require('https');
const http = require('http');

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                      PROFILE HANDLING MODULE                               ║
// ║                                                                            ║
// ║  Made by Titan X Dev                                                       ║
// ║  Bot Modifier By Titan                                                     ║
// ╚════════════════════════════════════════════════════════════════════════════╝

async function handleSetProfile(message, args, rest) {
    try {
        console.log('📍 Profile Handler: Starting profile update process');
        
        if (args.length < 1) {
            console.log('❌ Profile Handler: Missing required arguments');
            return message.reply(
                '❌ Usage: `!setprofile <avatar_url> <banner_url> [bio]`\n' +
                'Example: `!setprofile https://i.imgur.com/avatar.png https://i.imgur.com/banner.png Titan  X Dev Op`'
            );
        }

        const statusMsg = await message.reply('⏳ Updating server profile...');
        console.log('🔄 Profile Handler: Sent processing notification to user');

        const avatarUrl = args[0];
        const bannerUrl = args[1];
        const bio = args.slice(2).join(' ') || `Custom profile for ${message.guild.name}`;
        
        console.log(`📄 Profile Handler: Profile parameters received`);
        console.log(`   Avatar URL: ${avatarUrl ? `${avatarUrl.substring(0, 30)}...` : 'NOT PROVIDED'}`);
        console.log(`   Banner URL: ${bannerUrl ? `${bannerUrl.substring(0, 30)}...` : 'NOT PROVIDED'}`);
        console.log(`   Bio: ${bio.substring(0, 30)}${bio.length > 30 ? '...' : ''}`);

        let avatarData = null;
        let bannerData = null;

        // Download and encode avatar
        if (avatarUrl && isUrl(avatarUrl)) {
            console.log('👤 Profile Handler: Processing avatar image');
            avatarData = await downloadAndEncodeImage(avatarUrl);
            if (!avatarData) {
                console.log('❌ Profile Handler: Failed to process avatar image');
                return statusMsg.edit('❌ Failed to download avatar image. Check the URL and try again.');
            }
            console.log('✅ Profile Handler: Avatar image processed successfully');
        }

        // Download and encode banner
        if (bannerUrl && isUrl(bannerUrl)) {
            console.log('🖼️ Profile Handler: Processing banner image');
            bannerData = await downloadAndEncodeImage(bannerUrl);
            if (!bannerData) {
                console.log('❌ Profile Handler: Failed to process banner image');
                return statusMsg.edit('❌ Failed to download banner image. Check the URL and try again.');
            }
            console.log('✅ Profile Handler: Banner image processed successfully');
        }

        console.log('📡 Profile Handler: Sending PATCH request to Discord API');
        const response = await rest.patch(
            Routes.guildMember(message.guild.id, '@me'),
            {
                body: {
                    avatar: avatarData,
                    banner: bannerData,
                    bio: bio
                }
            }
        );
        
        console.log('✅ Profile Handler: Profile updated successfully on Discord');

        await statusMsg.edit(
            '✅ Server profile updated successfully!\n' +
            `Avatar: ${avatarData ? '✅' : '❌'}\n` +
            `Banner: ${bannerData ? '✅' : '❌'}\n` +
            `Bio: ✅`
        );
        
        // Log success with additional details
        console.log(`🎉 Profile Update Success:`);
        console.log(`   User: ${message.author.tag}`);
        console.log(`   Server: ${message.guild.name}`);
        console.log(`   Time: ${new Date().toISOString()}`);

    } catch (error) {
        console.error('💥 Profile Handler: Critical Error Occurred');
        console.error('   Error Details:', error);
        message.reply(`❌ Error: ${error.message}`);
    }
}


async function handleSetBanner(message, args, rest) {
    try {
        console.log('📍 Banner Handler: Starting banner update process');
        
        if (args.length < 1) {
            console.log('❌ Banner Handler: Missing required arguments');
            return message.reply(
                '❌ Usage: `!setbanner <image_url>`\n' +
                'Example: `!setbanner https://i.imgur.com/banner.png`'
            );
        }

        const statusMsg = await message.reply('⏳ Updating banner...');
        console.log('🔄 Banner Handler: Sent processing notification to user');

        const imageUrl = args[0];
        console.log(`📥 Banner Handler: Received image URL - ${imageUrl.substring(0, 50)}${imageUrl.length > 50 ? '...' : ''}`);

        if (!isUrl(imageUrl)) {
            console.log('❌ Banner Handler: Invalid URL provided');
            return statusMsg.edit('❌ Please provide a valid image URL.');
        }

        console.log('🌐 Banner Handler: Downloading image from remote server...');
        const bannerData = await downloadAndEncodeImage(imageUrl);

        if (!bannerData) {
            console.log('❌ Banner Handler: Failed to download/encode image');
            return statusMsg.edit('❌ Failed to download image. Check the URL and try again.');
        }
        
        console.log('✅ Banner Handler: Image downloaded and encoded successfully');

        console.log('📡 Banner Handler: Sending PATCH request to Discord API');
        await rest.patch(
            Routes.guildMember(message.guild.id, '@me'),
            {
                body: {
                    banner: bannerData
                }
            }
        );
        
        console.log('✅ Banner Handler: Banner updated successfully on Discord');
        await statusMsg.edit('✅ Server banner updated successfully!');
        
        // Log success with additional details
        console.log(`🎉 Banner Update Success:`);
        console.log(`   User: ${message.author.tag}`);
        console.log(`   Server: ${message.guild.name}`);
        console.log(`   Time: ${new Date().toISOString()}`);

    } catch (error) {
        console.error('💥 Banner Handler: Critical Error Occurred');
        console.error('   Error Details:', error);
        message.reply(`❌ Error: ${error.message}`);
    }
}


async function handleResetProfile(message, rest) {
    try {
        console.log('📍 Reset Handler: Starting profile reset process');
        
        const statusMsg = await message.reply('⏳ Resetting server profile...');
        console.log('🔄 Reset Handler: Sent processing notification to user');

        console.log('📡 Reset Handler: Sending PATCH request to Discord API');
        await rest.patch(
            Routes.guildMember(message.guild.id, '@me'),
            {
                body: {
                    avatar: null,
                    banner: null,
                    bio: null
                }
            }
        );
        
        console.log('✅ Reset Handler: Profile reset successfully on Discord');
        await statusMsg.edit('✅ Server profile reset successfully!');
        
        console.log(`🎉 Profile Reset Success:`);
        console.log(`   User: ${message.author.tag}`);
        console.log(`   Server: ${message.guild.name}`);
        console.log(`   Time: ${new Date().toISOString()}`);

    } catch (error) {
        console.error('💥 Reset Handler: Critical Error Occurred');
        console.error('   Error Details:', error);
        message.reply(`❌ Error: ${error.message}`);
    }
}

function downloadAndEncodeImage(url) {
    console.log(`📥 Image Downloader: Starting download from ${url.substring(0, 40)}${url.length > 40 ? '...' : ''}`);
    
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            console.log(`📡 Image Downloader: Server responded with status ${response.statusCode}`);
            
            if (response.statusCode !== 200) {
                console.log(`❌ Image Downloader: HTTP Error ${response.statusCode}`);
                resolve(null);
                return;
            }

            const chunks = [];
            let totalBytes = 0;

            response.on('data', (chunk) => {
                chunks.push(chunk);
                totalBytes += chunk.length;
                // Limit log frequency for large files
                if (totalBytes % 10000 < chunk.length) {
                    console.log(`📥 Image Downloader: Received ${chunk.length} bytes (Total: ${totalBytes})`);
                }
            });

            response.on('end', () => {
                try {
                    console.log(`✅ Image Downloader: Download completed (${totalBytes} bytes)`);
                    const buffer = Buffer.concat(chunks);
                    const base64 = buffer.toString('base64');
                    const mimeType = getMimeTypeFromUrl(url) || 'image/png';
                    const dataUri = `data:${mimeType};base64,${base64}`;
                    
                    console.log(`📦 Image Downloader: Encoding completed`);
                    console.log(`   MIME Type: ${mimeType}`);
                    console.log(`   Base64 Length: ${base64.length} characters`);
                    
                    resolve(dataUri);
                } catch (error) {
                    console.error('💥 Image Downloader: Encoding Error', error);
                    resolve(null);
                }
            });

        }).on('error', (error) => {
            console.error('💥 Image Downloader: Network Error', error);
            resolve(null);
        });
    });
}

function isUrl(string) {
    const result = string.startsWith('http://') || string.startsWith('https://');
    console.log(`🔍 URL Validator: ${string.substring(0, 30)}${string.length > 30 ? '...' : ''} -> ${result ? 'VALID' : 'INVALID'}`);
    return result;
}


function getMimeTypeFromUrl(url) {
    const ext = url.split('.').pop().split('?')[0].toLowerCase();
    const mimeTypes = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp'
    };
    
    const mimeType = mimeTypes[ext] || 'image/png';
    console.log(`🏷️  MIME Detector: Extension '${ext}' -> MIME '${mimeType}'`);
    return mimeType;
}

module.exports = { handleSetProfile, handleSetBanner, handleResetProfile };