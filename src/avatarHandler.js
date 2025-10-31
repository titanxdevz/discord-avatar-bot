const { REST, Routes } = require('discord.js');
const https = require('https');
const http = require('http');

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                       AVATAR HANDLING MODULE                               ║
// ║                                                                            ║
// ║  Made by Titan X Dev                                                       ║
// ║  Bot Modifier By Titan                                                     ║
// ╚════════════════════════════════════════════════════════════════════════════╝

async function handleSetAvatar(message, args, rest) {
    try {
        console.log('📍 Avatar Handler: Starting avatar update process');
        
        if (args.length < 1) {
            console.log('❌ Avatar Handler: Missing required arguments');
            return message.reply(
                '❌ Usage: `!setavatar <image_url>`\n' +
                'Example: `!setavatar https://i.imgur.com/avatar.png`'
            );
        }

        const statusMsg = await message.reply('⏳ Updating avatar...');
        console.log('🔄 Avatar Handler: Sent processing notification to user');

        const imageUrl = args[0];
        console.log(`📥 Avatar Handler: Received image URL - ${imageUrl.substring(0, 50)}${imageUrl.length > 50 ? '...' : ''}`);

        if (!isUrl(imageUrl)) {
            console.log('❌ Avatar Handler: Invalid URL provided');
            return statusMsg.edit('❌ Please provide a valid image URL.');
        }

        console.log('🌐 Avatar Handler: Downloading image from remote server...');
        const avatarData = await downloadAndEncodeImage(imageUrl);

        if (!avatarData) {
            console.log('❌ Avatar Handler: Failed to download/encode image');
            return statusMsg.edit('❌ Failed to download image. Check the URL and try again.');
        }
        
        console.log('✅ Avatar Handler: Image downloaded and encoded successfully');
        console.log(`📊 Avatar Handler: Encoded data size: ${avatarData.length} characters`);

        console.log('📡 Avatar Handler: Sending PATCH request to Discord API');
        await rest.patch(
            Routes.guildMember(message.guild.id, '@me'),
            {
                body: {
                    avatar: avatarData
                }
            }
        );
        
        console.log('✅ Avatar Handler: Avatar updated successfully on Discord');
        await statusMsg.edit('✅ Server avatar updated successfully!');
        
        // Log success with additional details
        console.log(`🎉 Avatar Update Success:`);
        console.log(`   User: ${message.author.tag}`);
        console.log(`   Server: ${message.guild.name}`);
        console.log(`   Time: ${new Date().toISOString()}`);

    } catch (error) {
        console.error('💥 Avatar Handler: Critical Error Occurred');
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
                console.log(`📥 Image Downloader: Received ${chunk.length} bytes (Total: ${totalBytes})`);
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

module.exports = { handleSetAvatar };