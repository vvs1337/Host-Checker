import { Client } from 'discord.js';
import fetch from 'node-fetch';

const client = new Client();
const PREFIX = '!';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'checkvpn') {
        const ip = args[0];
        const isValidIP = (ip) => {
            const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return ipRegex.test(ip);
        };
        
        // Dans la fonction checkvpn, avant d'effectuer la vérification de l'adresse IP
        if (!isValidIP(ip)) {
            return message.reply('Veuillez me procurez une ip valide.');
        }
        if (!ip) {
            return message.reply('Veuillez me procurez une ip valide.');
        }

        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            let vpnStatus = '';
            if (data.error || data.vpn) {
                vpnStatus = 'Oui';
            } else {
                vpnStatus = 'Non';
            }


            const hostname = data.hostname !== undefined ? data.hostname : 'Non spécifié';


            const postalCode = data.postal ? data.postal.substring(0, 3) : '';

            const formattedResponse = `
\`\`\`
Informations sur l'adresse IP ${ip} :
IP: ${data.ip}
Ville: ${data.city}
Région: ${data.region}
Pays: ${data.country}
Organisation: ${data.org}
Code Postal: ${postalCode}
Fuseau Horaire: ${data.timezone}
Est-ce un VPN ? ${vpnStatus}
\`\`\`
`;

            message.channel.send(formattedResponse);
        } catch (error) {
            console.error('Une erreur s'est produite lors de la vérification de l'adresse IP :', error);
            message.channel.send('Une erreur s'est produite lors de la vérification de l'adresse IP.');
        }
    }
});

client.login('MTIxODk4MzM0NzE1NDU4NzcyMA.G58myn.0o4PsCai8azYsC0_D3i9Bt_rNeuNw_mYrgt9xI')