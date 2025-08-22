# Environment Configuration

This document provides comprehensive information about environment variables and configuration options for PortFolium.

## 📋 Table of Contents

- [Environment Files](#environment-files)
- [Database Configuration](#database-configuration)
- [Authentication & Security](#authentication--security)
- [Server Configuration](#server-configuration)
- [File Upload Configuration](#file-upload-configuration)
- [External Services](#external-services)
- [Development vs Production](#development-vs-production)
- [Environment Examples](#environment-examples)

## 📁 Environment Files

### File Locations

- **Server Environment**: `server/.env`
- **Client Environment**: `client/.env` (optional)

### Loading Priority

Environment variables are loaded in the following order (later values override earlier ones):

1. System environment variables
2. `.env` file
3. Command line arguments

## 🗄️ Database Configuration

### MongoDB Settings

#### `MONGODB_URI` (Required)
- **Description**: MongoDB connection string
- **Type**: String (URI format)
- **Default**: None
- **Examples**:
  ```env
  # Local development
  MONGODB_URI=mongodb://localhost:27017/portfolium

  # With authentication
  MONGODB_URI=mongodb://username:password@localhost:27017/portfolium

  # MongoDB Atlas
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolium

  # Replica set
  MONGODB_URI=mongodb://host1:27017,host2:27017,host3:27017/portfolium?replicaSet=myReplicaSet
  ```

#### Connection Pool Settings (Optional)

```env
# Maximum number of connections in the connection pool
MONGODB_MAX_POOL_SIZE=10

# Minimum number of connections in the connection pool
MONGODB_MIN_POOL_SIZE=5

# Time to wait for a connection to become available (ms)
MONGODB_SERVER_SELECTION_TIMEOUT=5000

# Time to wait for a socket to connect (ms)
MONGODB_SOCKET_TIMEOUT=45000
```

## 🔐 Authentication & Security

### JWT Configuration

#### `JWT_SECRET` (Required)
- **Description**: Secret key for signing JWT tokens
- **Type**: String (minimum 32 characters recommended)
- **Security**: Keep this secret and use a strong, random value
- **Generation**:
  ```bash
  # Generate a secure random string
  openssl rand -base64 32
  
  # Or use Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

#### `JWT_ACCESS_TOKEN_EXPIRY` (Optional)
- **Description**: Access token expiration time
- **Type**: String (time format)
- **Default**: `15m`
- **Examples**: `15m`, `1h`, `2d`

#### `JWT_REFRESH_TOKEN_EXPIRY` (Optional)
- **Description**: Refresh token expiration time
- **Type**: String (time format)
- **Default**: `7d`
- **Examples**: `7d`, `30d`, `90d`

### Password Security

#### `BCRYPT_SALT_ROUNDS` (Optional)
- **Description**: Number of salt rounds for password hashing
- **Type**: Integer
- **Default**: `10`
- **Range**: 10-15 (higher = more secure but slower)

### Security Headers

#### `HELMET_ENABLED` (Optional)
- **Description**: Enable Helmet.js security headers
- **Type**: Boolean
- **Default**: `true`

#### `CORS_ORIGIN` (Optional)
- **Description**: Allowed CORS origins
- **Type**: String or comma-separated list
- **Default**: `*` (development), specific domain (production)
- **Examples**:
  ```env
  # Single origin
  CORS_ORIGIN=https://yourdomain.com
  
  # Multiple origins
  CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
  
  # Development (allow all)
  CORS_ORIGIN=*
  ```

## 🖥️ Server Configuration

### Basic Server Settings

#### `PORT` (Optional)
- **Description**: Port number for the server to listen on
- **Type**: Integer
- **Default**: `3000`
- **Range**: 1024-65535 (avoid system ports below 1024)

#### `NODE_ENV` (Required)
- **Description**: Application environment
- **Type**: String
- **Values**: `development`, `production`, `test`
- **Default**: `development`

#### `HOST` (Optional)
- **Description**: Host address to bind the server
- **Type**: String
- **Default**: `localhost`
- **Examples**: `0.0.0.0` (all interfaces), `127.0.0.1` (localhost only)

### Rate Limiting

#### `RATE_LIMIT_WINDOW_MS` (Optional)
- **Description**: Rate limiting time window in milliseconds
- **Type**: Integer
- **Default**: `900000` (15 minutes)

#### `RATE_LIMIT_MAX_REQUESTS` (Optional)
- **Description**: Maximum requests per time window
- **Type**: Integer
- **Default**: `100`

#### `RATE_LIMIT_AUTH_MAX` (Optional)
- **Description**: Maximum auth requests per window
- **Type**: Integer
- **Default**: `5`

### Session Configuration

#### `SESSION_SECRET` (Optional)
- **Description**: Secret for session signing
- **Type**: String
- **Default**: Uses JWT_SECRET if not provided

#### `SESSION_TIMEOUT` (Optional)
- **Description**: Session timeout in milliseconds
- **Type**: Integer
- **Default**: `3600000` (1 hour)

## 📁 File Upload Configuration

### Upload Limits

#### `UPLOAD_MAX_SIZE` (Optional)
- **Description**: Maximum file size for uploads in bytes
- **Type**: Integer
- **Default**: `10485760` (10MB)
- **Examples**:
  ```env
  UPLOAD_MAX_SIZE=5242880    # 5MB
  UPLOAD_MAX_SIZE=20971520   # 20MB
  UPLOAD_MAX_SIZE=52428800   # 50MB
  ```

#### `UPLOAD_ALLOWED_TYPES` (Optional)
- **Description**: Comma-separated list of allowed MIME types
- **Type**: String
- **Default**: `image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml`

### Storage Configuration

#### `UPLOAD_PATH` (Optional)
- **Description**: Directory path for file uploads
- **Type**: String
- **Default**: `./uploads`

#### `UPLOAD_URL_PREFIX` (Optional)
- **Description**: URL prefix for serving uploaded files
- **Type**: String
- **Default**: `/uploads`

### Image Processing

#### `IMAGE_QUALITY` (Optional)
- **Description**: JPEG compression quality (1-100)
- **Type**: Integer
- **Default**: `85`

#### `IMAGE_MAX_WIDTH` (Optional)
- **Description**: Maximum image width for resizing
- **Type**: Integer
- **Default**: `1200`

#### `IMAGE_MAX_HEIGHT` (Optional)
- **Description**: Maximum image height for resizing
- **Type**: Integer
- **Default**: `800`

## 🌐 External Services

### Email Configuration (Future Use)

#### `SMTP_HOST` (Optional)
- **Description**: SMTP server hostname
- **Type**: String
- **Example**: `smtp.gmail.com`

#### `SMTP_PORT` (Optional)
- **Description**: SMTP server port
- **Type**: Integer
- **Default**: `587`

#### `SMTP_USER` (Optional)
- **Description**: SMTP username
- **Type**: String

#### `SMTP_PASS` (Optional)
- **Description**: SMTP password
- **Type**: String
- **Security**: Use app-specific passwords when possible

### Analytics (Future Use)

#### `GOOGLE_ANALYTICS_ID` (Optional)
- **Description**: Google Analytics tracking ID
- **Type**: String
- **Format**: `GA_MEASUREMENT_ID`

#### `PLAUSIBLE_DOMAIN` (Optional)
- **Description**: Plausible Analytics domain
- **Type**: String

### Cloud Storage (Future Use)

#### `AWS_ACCESS_KEY_ID` (Optional)
- **Description**: AWS access key for S3 storage
- **Type**: String

#### `AWS_SECRET_ACCESS_KEY` (Optional)
- **Description**: AWS secret key for S3 storage
- **Type**: String

#### `AWS_REGION` (Optional)
- **Description**: AWS region for S3 bucket
- **Type**: String
- **Default**: `us-east-1`

#### `AWS_S3_BUCKET` (Optional)
- **Description**: S3 bucket name for file storage
- **Type**: String

## 🔄 Development vs Production

### Development Environment

```env
# Development configuration
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolium_dev
JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=*
RATE_LIMIT_MAX_REQUESTS=1000
HELMET_ENABLED=false
```

### Production Environment

```env
# Production configuration
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://username:password@localhost:27017/portfolium_prod
JWT_SECRET=super-secure-production-secret-key-32-chars-min
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
HELMET_ENABLED=true
BCRYPT_SALT_ROUNDS=12
```

### Testing Environment

```env
# Test configuration
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/portfolium_test
JWT_SECRET=test-secret-key
RATE_LIMIT_MAX_REQUESTS=10000
```

## 📝 Environment Examples

### Complete Development `.env`

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolium

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Server Configuration
PORT=3000
NODE_ENV=development
HOST=localhost

# Security Configuration
CORS_ORIGIN=*
HELMET_ENABLED=false
BCRYPT_SALT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_AUTH_MAX=50

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml
UPLOAD_PATH=./uploads
UPLOAD_URL_PREFIX=/uploads

# Image Processing
IMAGE_QUALITY=85
IMAGE_MAX_WIDTH=1200
IMAGE_MAX_HEIGHT=800
```

### Complete Production `.env`

```env
# Database Configuration
MONGODB_URI=mongodb://portfolium_user:secure_password@localhost:27017/portfolium_prod

# JWT Configuration
JWT_SECRET=super-secure-production-jwt-secret-key-generated-with-openssl
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Server Configuration
PORT=3000
NODE_ENV=production
HOST=0.0.0.0

# Security Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
HELMET_ENABLED=true
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=5

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml
UPLOAD_PATH=/var/www/portfolium/server/uploads
UPLOAD_URL_PREFIX=/uploads

# Image Processing
IMAGE_QUALITY=80
IMAGE_MAX_WIDTH=1200
IMAGE_MAX_HEIGHT=800

# Session Configuration
SESSION_TIMEOUT=3600000

# Email Configuration (if implemented)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Analytics (if implemented)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🔒 Security Best Practices

### Environment Variable Security

1. **Never commit `.env` files** to version control
2. **Use strong, random secrets** for JWT and session keys
3. **Rotate secrets regularly** in production
4. **Use different secrets** for each environment
5. **Limit CORS origins** in production
6. **Enable security headers** in production

### Secret Management

#### For Development
```bash
# Generate secure secrets
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### For Production
- Use environment variable management services
- Consider using Docker secrets or Kubernetes secrets
- Use cloud provider secret management (AWS Secrets Manager, etc.)
- Implement secret rotation policies

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```env
# Check connection string format
MONGODB_URI=mongodb://username:password@host:port/database

# For special characters in password, URL encode them
# Example: password with @ becomes %40
```

#### JWT Token Issues
```bash
# Ensure JWT_SECRET is at least 32 characters
echo $JWT_SECRET | wc -c

# Generate new secret if needed
openssl rand -base64 32
```

#### File Upload Issues
```bash
# Check upload directory permissions
ls -la server/uploads/

# Fix permissions if needed
chmod 755 server/uploads/
chown -R $USER:$USER server/uploads/
```

### Environment Validation

Add this to your server startup to validate required environment variables:

```javascript
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}
```

## 📞 Support

If you encounter issues with environment configuration:

1. Check this documentation for the correct format
2. Validate your `.env` file syntax
3. Ensure all required variables are set
4. Check file permissions for upload directories
5. Verify MongoDB connection string format
6. Create an issue on GitHub with your configuration (remove sensitive values)

---

**Environment Configuration Guide - Last Updated: December 2023**