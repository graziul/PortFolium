# PortFolium Deployment Guide

This guide provides step-by-step instructions for deploying PortFolium on a DigitalOcean droplet running Ubuntu 25.04.

## 🖥️ Server Requirements

### Minimum Specifications
- **OS**: Ubuntu 25.04 LTS
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB SSD minimum (40GB recommended)
- **CPU**: 1 vCPU minimum (2 vCPU recommended)
- **Network**: 1TB transfer

### Recommended DigitalOcean Droplet
- **Size**: Basic Droplet - $12/month (2GB RAM, 1 vCPU, 50GB SSD)
- **Region**: Choose closest to your target audience
- **Image**: Ubuntu 25.04 LTS x64

## 🚀 Initial Server Setup

### 1. Create and Access Your Droplet

```bash
# SSH into your droplet
ssh root@your_server_ip

# Update system packages
apt update && apt upgrade -y

# Create a new user (replace 'portfolium' with your preferred username)
adduser portfolium
usermod -aG sudo portfolium

# Set up SSH key authentication (optional but recommended)
mkdir -p /home/portfolium/.ssh
cp ~/.ssh/authorized_keys /home/portfolium/.ssh/
chown -R portfolium:portfolium /home/portfolium/.ssh
chmod 700 /home/portfolium/.ssh
chmod 600 /home/portfolium/.ssh/authorized_keys

# Switch to new user
su - portfolium
```

### 2. Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # For development/testing

# Check firewall status
sudo ufw status
```

## 📦 Install Dependencies

### 1. Install Node.js (v20 LTS)

```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Install MongoDB

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list and install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 3. Install Nginx (Web Server)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

### 4. Install Additional Tools

```bash
# Install Git, build tools, and other utilities
sudo apt install -y git build-essential curl wget unzip

# Install certbot for SSL certificates
sudo apt install -y certbot python3-certbot-nginx
```

## 🏗️ Application Deployment

### 1. Clone and Setup Application

```bash
# Navigate to web directory
cd /var/www

# Clone the repository
sudo git clone https://github.com/yourusername/portfolium.git
sudo chown -R portfolium:portfolium portfolium
cd portfolium

# Install dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

```bash
# Create production environment file
sudo nano server/.env
```

Add the following configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolium_prod

# JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret-key-here

# Server Configuration
PORT=3000
NODE_ENV=production

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml

# Security Configuration
CORS_ORIGIN=https://yourdomain.com
```

**Important**: Generate a strong JWT secret:
```bash
# Generate a secure random string
openssl rand -base64 32
```

### 3. Build the Application

```bash
# Build the React frontend
cd client
npm run build
cd ..

# Create uploads directory
mkdir -p server/uploads/projects
mkdir -p server/uploads/blog
mkdir -p server/uploads/profile
sudo chown -R portfolium:portfolium server/uploads
```

### 4. Configure MongoDB for Production

```bash
# Create MongoDB user for the application
mongosh

# In MongoDB shell:
use portfolium_prod
db.createUser({
  user: "portfolium_user",
  pwd: "secure_password_here",
  roles: [
    { role: "readWrite", db: "portfolium_prod" }
  ]
})
exit
```

Update your `.env` file with authentication:
```env
MONGODB_URI=mongodb://portfolium_user:secure_password_here@localhost:27017/portfolium_prod
```

## 🔧 Configure Nginx

### 1. Create Nginx Configuration

```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/portfolium
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be added by certbot)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Root directory for static files
    root /var/www/portfolium/client/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Serve uploaded files
    location /uploads/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security: deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

### 2. Enable the Site

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/portfolium /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 SSL Certificate Setup

### 1. Obtain SSL Certificate with Let's Encrypt

```bash
# Make sure your domain points to your server IP first
# Then run certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### 2. Set up Automatic Renewal

```bash
# Add cron job for automatic renewal
sudo crontab -e

# Add this line to renew certificates twice daily
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Process Management with PM2

### 1. Create PM2 Configuration

```bash
# Create PM2 ecosystem file
nano /var/www/portfolium/ecosystem.config.js
```

Add the following configuration:

```javascript
module.exports = {
  apps: [{
    name: 'portfolium-backend',
    script: './server/server.js',
    cwd: '/var/www/portfolium',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Start the Application

```bash
# Create logs directory
mkdir -p /var/www/portfolium/logs

# Start the application with PM2
cd /var/www/portfolium
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above

# Check application status
pm2 status
pm2 logs portfolium-backend
```

## 📊 Monitoring and Maintenance

### 1. Set up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/portfolium
```

Add the following:

```
/var/www/portfolium/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 portfolium portfolium
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. System Monitoring

```bash
# Install htop for system monitoring
sudo apt install -y htop

# Monitor system resources
htop

# Monitor PM2 processes
pm2 monit

# Check disk usage
df -h

# Check memory usage
free -h

# Monitor MongoDB
sudo systemctl status mongod
```

### 3. Backup Strategy

```bash
# Create backup script
nano /home/portfolium/backup.sh
```

Add the following script:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/portfolium/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="portfolium_prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --db $DB_NAME --out $BACKUP_DIR/mongodb_$DATE

# Application files backup (excluding node_modules and uploads)
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='uploads' \
    --exclude='.git' \
    -C /var/www portfolium

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete
find $BACKUP_DIR -type d -empty -delete

echo "Backup completed: $DATE"
```

Make it executable and set up cron job:

```bash
chmod +x /home/portfolium/backup.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /home/portfolium/backup.sh
```

## 🔄 Deployment Updates

### 1. Update Script

Create an update script for easy deployments:

```bash
nano /home/portfolium/update.sh
```

```bash
#!/bin/bash

echo "Starting PortFolium update..."

# Navigate to project directory
cd /var/www/portfolium

# Backup current version
cp -r . ../portfolium_backup_$(date +%Y%m%d_%H%M%S)

# Pull latest changes
git pull origin main

# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
cd client && npm run build && cd ..

# Restart application
pm2 restart portfolium-backend

# Check status
pm2 status

echo "Update completed!"
```

Make it executable:
```bash
chmod +x /home/portfolium/update.sh
```

### 2. Zero-Downtime Deployment

For zero-downtime deployments, use PM2's reload feature:

```bash
# Reload application without downtime
pm2 reload portfolium-backend

# Or use the ecosystem file
pm2 reload ecosystem.config.js
```

## 🛡️ Security Hardening

### 1. MongoDB Security

```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf
```

Add security settings:

```yaml
security:
  authorization: enabled

net:
  bindIp: 127.0.0.1
  port: 27017
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

### 2. System Security

```bash
# Install fail2ban for intrusion prevention
sudo apt install -y fail2ban

# Configure fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Start fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no (if using SSH keys)

sudo systemctl restart ssh
```

### 3. Application Security

Update your `.env` file with additional security settings:

```env
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS settings
CORS_ORIGIN=https://yourdomain.com

# Security headers
HELMET_ENABLED=true
```

## 🔍 Troubleshooting

### Common Issues and Solutions

1. **Application won't start**
   ```bash
   # Check logs
   pm2 logs portfolium-backend
   
   # Check MongoDB connection
   mongosh
   
   # Verify environment variables
   cat server/.env
   ```

2. **502 Bad Gateway**
   ```bash
   # Check if backend is running
   pm2 status
   
   # Check Nginx configuration
   sudo nginx -t
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **File upload issues**
   ```bash
   # Check uploads directory permissions
   ls -la server/uploads/
   
   # Fix permissions if needed
   sudo chown -R portfolium:portfolium server/uploads
   chmod -R 755 server/uploads
   ```

4. **Database connection issues**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Check MongoDB logs
   sudo tail -f /var/log/mongodb/mongod.log
   
   # Test connection
   mongosh "mongodb://portfolium_user:password@localhost:27017/portfolium_prod"
   ```

### Performance Optimization

1. **Enable MongoDB indexing**
   ```javascript
   // Connect to MongoDB and create indexes
   mongosh "mongodb://portfolium_user:password@localhost:27017/portfolium_prod"
   
   // Create indexes for better performance
   db.projects.createIndex({ userId: 1, createdAt: -1 })
   db.blogposts.createIndex({ userId: 1, published: 1 })
   db.skills.createIndex({ userId: 1, category: 1 })
   ```

2. **Optimize Nginx**
   ```nginx
   # Add to nginx.conf
   worker_processes auto;
   worker_connections 1024;
   
   # Enable caching
   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
   ```

## 📞 Support

If you encounter issues during deployment:

1. Check the application logs: `pm2 logs portfolium-backend`
2. Check system logs: `sudo journalctl -f`
3. Verify all services are running: `sudo systemctl status nginx mongod`
4. Review the troubleshooting section above
5. Create an issue on the GitHub repository with detailed error information

---

**Deployment completed successfully! Your PortFolium application should now be running at https://yourdomain.com**