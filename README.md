# PortFolium

A modern, interactive personal portfolio website featuring a dynamic project tracker, contemporary blog platform, and comprehensive skills showcase. Built with React frontend and Express.js backend.

## 🌟 Features

### Core Functionality
- **Dynamic Project Tracker**: Kanban-style project management with drag-and-drop functionality
- **Blog Platform**: Full-featured blog with rich text editing, image uploads, and categorization
- **Skills Showcase**: Interactive skills management with categories and experience levels
- **User Profiles**: Comprehensive profile management with experience and education tracking
- **Timeline Management**: Career timeline with milestones and achievements
- **Collaboration Tools**: Project collaboration and sponsor management features

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live project status tracking
- **Image Management**: Automatic image optimization and resizing
- **Search & Filtering**: Advanced search across projects and blog posts
- **Authentication**: Secure JWT-based authentication system
- **File Uploads**: Support for various image formats with automatic processing

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolium.git
   cd portfolium
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolium
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

5. **Run the application**
   ```bash
   npm run start
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

## 📁 Project Structure

```
portfolium/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/           # API request functions
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── server/                # Express.js backend application
│   ├── config/           # Configuration files
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic services
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   ├── uploads/          # File upload storage
│   └── package.json      # Backend dependencies
│
├── docs/                 # Additional documentation
├── README.md            # This file
└── package.json         # Root package.json
```

## 🛠 Development

### Available Scripts

- `npm run start` - Start both frontend and backend in development mode
- `npm run dev` - Same as start (development mode)
- `npm run build` - Build the frontend for production
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server

### Environment Setup

1. **MongoDB Setup**
   - Install MongoDB Community Edition
   - Create a database named `portfolium`
   - Ensure MongoDB is running on default port 27017

2. **Development Environment**
   ```bash
   # Install nodemon for auto-restart during development
   npm install -g nodemon
   
   # Start development server with auto-reload
   npm run dev
   ```

### Code Structure Guidelines

- **Frontend**: React with TypeScript, Tailwind CSS for styling
- **Backend**: Express.js with MongoDB and Mongoose
- **Authentication**: JWT tokens with refresh token support
- **File Storage**: Local file system with automatic image optimization
- **API Design**: RESTful endpoints with consistent error handling

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project
- [Environment Configuration](./ENVIRONMENT.md) - Environment variables reference

## 🔧 Configuration

### Environment Variables

See [ENVIRONMENT.md](./ENVIRONMENT.md) for a complete list of configuration options.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### File Upload Configuration

The application supports image uploads with automatic processing:
- **Supported formats**: JPEG, PNG, GIF, WebP, SVG
- **Maximum file size**: 10MB
- **Storage location**: `server/uploads/`
- **Automatic optimization**: Images are resized and compressed

## 🚀 Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick production setup:
1. Set up a MongoDB instance
2. Configure environment variables for production
3. Build the frontend: `npm run build`
4. Start the production server: `NODE_ENV=production npm start`

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs/)
2. Search existing [issues](https://github.com/yourusername/portfolium/issues)
3. Create a new issue with detailed information
4. Join our community discussions

## 🎯 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations (GitHub, LinkedIn)
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch
- [ ] Automated testing suite expansion

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Express.js](https://expressjs.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database with [MongoDB](https://www.mongodb.com/)

---

**Made with ❤️ by the PortFolium team**