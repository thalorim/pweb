document.addEventListener('DOMContentLoaded', () => {
    initIconInteractions();
    fetchDiscordUser();
    setInterval(fetchDiscordUser, 5000);
});

function initIconInteractions() {
    const socialLinks = document.querySelectorAll('.social-link');
    const profileCard = document.querySelector('.profile-card');

    socialLinks.forEach(link => {
        link.addEventListener('mousemove', event => {
            const rect = link.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            link.style.setProperty('--x', `${x}%`);
            link.style.setProperty('--y', `${y}%`);
        });

        link.addEventListener('mouseleave', () => {
            link.style.removeProperty('--x');
            link.style.removeProperty('--y');
        });
    });

    if (profileCard) {
        profileCard.style.transition = 'transform 0.6s ease';
        profileCard.addEventListener('mousemove', handleTilt);
        profileCard.addEventListener('mouseleave', resetTilt);
    }

    function handleTilt(event) {
        const rect = this.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) - 0.5;
        const y = ((event.clientY - rect.top) / rect.height) - 0.5;
        this.style.transform = `perspective(1200px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    }

    function resetTilt() {
        this.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
}

// Discord API Integration
async function fetchDiscordUser() {
    const userId = "696471986137858069";
    const userApiUrl = `https://api.lanyard.rest/v1/users/${userId}`;
    
    try {
        const userRes = await fetch(userApiUrl);
        const userData = await userRes.json();

        if (userData && userData.success) {
            const user = userData.data.discord_user;
            const status = userData.data.discord_status;
            
            const discordAvatar = document.getElementById('discord-avatar');
            if (user.avatar) {
                discordAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
            } else {
                discordAvatar.src = "https://placehold.co/128x128";
            }
            
            const mainAvatar = document.getElementById('main-discord-avatar');
            
            const discordUsername = document.getElementById('discord-username');
            discordUsername.textContent = user.display_name || user.username;
            
            const discordUsernameDisplay = document.getElementById('discord-username-display');
            discordUsernameDisplay.textContent = `@${user.username}`;
            
            const mainUsername = document.getElementById('main-discord-username');
            mainUsername.textContent = user.display_name || user.username;
            
            const discriminator = document.getElementById('main-discord-discriminator');
            discriminator.textContent = `@${user.username}`;
            
            const statusIndicator = document.getElementById('status-indicator');
            const statusText = document.getElementById('discord-status-text');
            const discordAvatarElement = document.getElementById('discord-avatar');
            
            const mainAvatarPulse = document.querySelectorAll('.avatar-pulse');
            
            mainAvatarPulse.forEach(avatar => avatar.className = 'avatar-pulse');
            discordAvatarElement.className = 'discord-status-avatar';
            statusIndicator.className = 'status-indicator';
            statusText.className = 'discord-status-text';

            if (status === 'online') {
                discordAvatarElement.classList.add('status-online');
                statusIndicator.classList.add('online');
                statusText.textContent = 'Online';
                mainAvatarPulse.forEach(a => a.classList.add('status-online'));
            } else if (status === 'idle') {
                discordAvatarElement.classList.add('status-idle');
                statusIndicator.classList.add('idle');
                statusText.classList.add('idle');
                statusText.textContent = 'Away';
                mainAvatarPulse.forEach(a => a.classList.add('status-idle'));
            } else if (status === 'dnd') {
                discordAvatarElement.classList.add('status-dnd');
                statusIndicator.classList.add('dnd');
                statusText.classList.add('dnd');
                statusText.textContent = 'Do Not Disturb';
                mainAvatarPulse.forEach(a => a.classList.add('status-dnd'));
            } else if (status === 'offline') {
                discordAvatarElement.classList.add('status-offline');
                statusIndicator.classList.add('offline');
                statusText.classList.add('offline');
                statusText.textContent = 'Offline';
                mainAvatarPulse.forEach(a => a.classList.add('status-offline'));
            } else {
                discordAvatarElement.classList.add('status-offline');
                statusIndicator.classList.add('offline');
                statusText.classList.add('offline');
                statusText.textContent = 'Offline';
                mainAvatarPulse.forEach(a => a.classList.add('status-offline'));
            }

        } else {
            const discordUsername = document.getElementById('discord-username');
            const mainUsername = document.getElementById('main-discord-username');
            const discriminator = document.getElementById('main-discord-discriminator');
            
            discordUsername.textContent = 'Unknown User';
            mainUsername.textContent = 'Unknown User';
            discriminator.textContent = '@unknown';
            
            const discordAvatar = document.getElementById('discord-avatar');
            const mainAvatar = document.getElementById('main-discord-avatar');
            discordAvatar.src = "https://placehold.co/128x128";
            mainAvatar.src = "https://placehold.co/128x128";
        }
    } catch (error) {
        console.error('Error fetching Discord user:', error);
        
        const discordUsername = document.getElementById('discord-username');
        const mainUsername = document.getElementById('main-discord-username');
        const discriminator = document.getElementById('main-discord-discriminator');
        
        discordUsername.textContent = 'Error Loading';
        mainUsername.textContent = 'Error Loading';
        discriminator.textContent = '@error';
        
        const discordAvatar = document.getElementById('discord-avatar');
        const mainAvatar = document.getElementById('main-discord-avatar');
        discordAvatar.src = "https://placehold.co/128x128";
        mainAvatar.src = "https://placehold.co/128x128";
    }
}
