# Dedicated IRC Server Setup for OE Tattoo Chat

Since the website is hosted on GitHub Pages (static hosting), we cannot run a server-side IRC daemon directly. However, you can set up a dedicated IRC server on a separate hosting platform (VPS, cloud instance, or container service) and update the chat.html iframe to point to it.

Alternatively, for immediate use, the chat page now connects to EFnet IRC network with the #humboldt channel. EFnet is a large, established IRC network where you can create and manage your own channels without needing your own server.

## Using EFnet Channels

EFnet is one of the oldest and largest IRC networks. You can:

1. **Join existing channels:** Use commands like `/join #california`, `/join #westcoast`, `/join #pacific` for west coast discussions
2. **Create your channel:** Simply join #humboldt - if it doesn't exist, you'll create it automatically
3. **Channel management:** As the first user in #humboldt, you'll have operator privileges
4. **Persistence:** Channels on EFnet persist as long as at least one user is in them

### Popular West Coast Channels on EFnet:
- #california
- #westcoast  
- #pacific
- #seattle
- #portland
- #sanfrancisco

To register your channel or get help, join #help and ask about ChanServ.

## Recommended Setup: ngIRCd on Ubuntu/Debian

ngIRCd is a lightweight, easy-to-configure IRC server.

### Prerequisites
- Ubuntu/Debian VPS or cloud instance (e.g., DigitalOcean, AWS EC2, Linode)
- Root or sudo access
- Domain name (optional, but recommended for SSL)

### Installation Steps

1. **Update system:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install ngIRCd:**
   ```bash
   sudo apt install ngircd -y
   ```

3. **Configure ngIRCd:**
   Edit `/etc/ngircd/ngircd.conf`:
   ```bash
   sudo nano /etc/ngircd/ngircd.conf
   ```

   Key configuration changes:
   ```
   [Global]
   Name = irc.oetattoos.com  # Your domain
   Info = OE Tattoo Community IRC
   Network = OE Tattoo Net

   [Server]
   Name = irc.oetattoos.com
   MyPassword = your_server_password  # Generate a secure password

   [Channel]
   Name = #humboldt
   Topic = Welcome to OE Tattoo Humboldt Channel
   Modes = t,n

   [Options]
   PAM = no
   ```

4. **Enable and start the service:**
   ```bash
   sudo systemctl enable ngircd
   sudo systemctl start ngircd
   ```

5. **Configure firewall:**
   ```bash
   sudo ufw allow 6667/tcp  # Standard IRC port
   sudo ufw allow 6697/tcp  # SSL IRC port (if configured)
   ```

6. **Test the server:**
   ```bash
   telnet localhost 6667
   ```

### SSL/TLS Configuration (Recommended)

1. **Install certbot:**
   ```bash
   sudo apt install certbot -y
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot certonly --standalone -d irc.oetattoos.com
   ```

3. **Configure ngIRCd for SSL:**
   In `/etc/ngircd/ngircd.conf`:
   ```
   [SSL]
   Ports = 6697
   KeyFile = /etc/letsencrypt/live/irc.oetattoos.com/privkey.pem
   CertFile = /etc/letsencrypt/live/irc.oetattoos.com/fullchain.pem
   ```

4. **Restart ngIRCd:**
   ```bash
   sudo systemctl restart ngircd
   ```

### Webchat Integration

Update `chat.html` iframe to use your server:
```html
<iframe src="https://webchat.hackint.org/?nick=&channels=%23humboldt&server=irc.oetattoos.com&port=6697&ssl=1" width="100%" height="600" frameborder="0"></iframe>
```

Or use KiwiIRC with your server:
```html
<iframe src="https://kiwiirc.com/nextclient/?settings=...your_config..." width="100%" height="600" frameborder="0"></iframe>
```

### Alternative: Docker Container

If you prefer containerized deployment:

1. **Install Docker:**
   ```bash
   sudo apt install docker.io -y
   ```

2. **Run ngIRCd container:**
   ```bash
   docker run -d --name ngircd -p 6667:6667 -p 6697:6697 -v /path/to/config:/etc/ngircd ngircd/ngircd
   ```

### Monitoring and Maintenance

- **Logs:** Check `/var/log/ngircd/ngircd.log`
- **Users:** Monitor connected users with IRC commands
- **Backups:** Backup `/etc/ngircd/ngircd.conf`
- **Updates:** Keep ngIRCd updated: `sudo apt update && sudo apt upgrade ngircd`

### Security Considerations

- Use strong passwords
- Enable SSL/TLS
- Configure firewall properly
- Monitor for abuse
- Consider rate limiting

### Cost

- VPS: ~$5-10/month
- Domain: ~$10-15/year
- SSL: Free with Let's Encrypt

For detailed documentation, visit: https://ngircd.barton.de/documentation.php</content>
<parameter name="filePath">/home/oe/Documents/bruh/tattoo_website/irc_server_setup.md