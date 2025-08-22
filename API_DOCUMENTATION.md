# PortFolium API Documentation

This document provides comprehensive documentation for the PortFolium REST API endpoints.

## 📋 Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Projects](#projects)
- [Blog Posts](#blog-posts)
- [Skills](#skills)
- [Home Content](#home-content)
- [Collaborators](#collaborators)
- [File Uploads](#file-uploads)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All API endpoints (except registration and login) require authentication using JWT Bearer tokens.

### Headers Required
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb54b24a1234567890a",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb54b24a1234567890a",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

## 👤 User Management

### Get User Profile
```http
GET /api/users/profile
```

**Response:**
```json
{
  "_id": "60d5ecb54b24a1234567890a",
  "email": "user@example.com",
  "name": "John Doe",
  "bio": "Full-stack developer passionate about creating amazing web applications.",
  "location": "San Francisco, CA",
  "phone": "+1-555-123-4567",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "website": "https://johndoe.dev"
  },
  "experiences": [...],
  "education": [...],
  "certifications": ["AWS Certified Developer", "Google Cloud Professional"],
  "languages": ["English", "Spanish"],
  "createdAt": "2023-06-25T10:30:00.000Z",
  "lastLoginAt": "2023-12-01T14:22:00.000Z",
  "isActive": true
}
```

### Update User Profile
```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Updated bio text",
  "location": "New York, NY",
  "phone": "+1-555-987-6543",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "website": "https://johndoe.dev"
  },
  "certifications": ["AWS Certified Developer"],
  "languages": ["English", "Spanish", "French"]
}
```

### Experience Management

#### Add Experience
```http
POST /api/users/profile/experience
```

**Request Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "company": "Tech Corp Inc.",
  "location": "San Francisco, CA",
  "startDate": "2022-01-15",
  "endDate": "2023-12-01",
  "current": false,
  "description": "Led development of scalable web applications...",
  "achievements": [
    "Increased application performance by 40%",
    "Led team of 5 developers"
  ]
}
```

#### Update Experience
```http
PUT /api/users/profile/experience/:experienceId
```

#### Delete Experience
```http
DELETE /api/users/profile/experience/:experienceId
```

### Education Management

#### Add Education
```http
POST /api/users/profile/education
```

**Request Body:**
```json
{
  "degree": "Bachelor of Science in Computer Science",
  "institution": "University of California, Berkeley",
  "location": "Berkeley, CA",
  "startDate": "2018-08-15",
  "endDate": "2022-05-15",
  "gpa": "3.8",
  "description": "Focus on software engineering and algorithms"
}
```

#### Update Education
```http
PUT /api/users/profile/education/:educationId
```

#### Delete Education
```http
DELETE /api/users/profile/education/:educationId
```

## 📁 Projects

### Get All Projects
```http
GET /api/projects
```

**Response:**
```json
{
  "projects": [
    {
      "_id": "60d5ecb54b24a1234567890b",
      "title": "E-commerce Platform",
      "description": "Full-stack e-commerce solution with React and Node.js",
      "shortDescription": "Modern e-commerce platform",
      "status": "completed",
      "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
      "liveUrl": "https://ecommerce-demo.com",
      "githubUrl": "https://github.com/johndoe/ecommerce",
      "paperUrl": null,
      "thumbnailUrl": "/uploads/projects/thumb-123.jpg",
      "bannerUrl": "/uploads/projects/banner-123.jpg",
      "archived": false,
      "featured": true,
      "order": 1,
      "startDate": "2023-01-15T00:00:00.000Z",
      "endDate": "2023-06-30T00:00:00.000Z",
      "openToCollaborators": false,
      "acceptingSponsors": false,
      "collaboratorCount": 3,
      "collaborators": [
        {
          "name": "Jane Smith",
          "role": "UI/UX Designer",
          "profileUrl": "https://linkedin.com/in/janesmith"
        }
      ],
      "enthusiasmLevel": "High",
      "mediaCoverage": [
        {
          "_id": "60d5ecb54b24a1234567890c",
          "title": "Revolutionary E-commerce Platform Launches",
          "url": "https://techcrunch.com/article",
          "publication": "TechCrunch",
          "publishedDate": "2023-07-01T00:00:00.000Z",
          "description": "A new approach to online shopping"
        }
      ],
      "userId": "60d5ecb54b24a1234567890a",
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-07-01T14:22:00.000Z"
    }
  ]
}
```

### Get Single Project
```http
GET /api/projects/:id
```

### Create Project
```http
POST /api/projects
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Detailed project description",
  "shortDescription": "Brief description",
  "status": "in-progress",
  "technologies": ["React", "TypeScript"],
  "liveUrl": "https://project-demo.com",
  "githubUrl": "https://github.com/user/project",
  "startDate": "2023-12-01T00:00:00.000Z",
  "openToCollaborators": true,
  "acceptingSponsors": false,
  "enthusiasmLevel": "Very High",
  "collaborators": [
    {
      "name": "Collaborator Name",
      "role": "Developer",
      "profileUrl": "https://linkedin.com/in/collaborator"
    }
  ]
}
```

### Update Project
```http
PUT /api/projects/:id
```

### Delete Project
```http
DELETE /api/projects/:id
```

### Update Projects Order
```http
PUT /api/projects/order
```

**Request Body:**
```json
{
  "projectIds": [
    "60d5ecb54b24a1234567890b",
    "60d5ecb54b24a1234567890c",
    "60d5ecb54b24a1234567890d"
  ]
}
```

### Project Updates

#### Get Project Updates
```http
GET /api/projects/:projectId/updates
```

**Response:**
```json
{
  "updates": [
    {
      "_id": "60d5ecb54b24a1234567890e",
      "projectId": "60d5ecb54b24a1234567890b",
      "type": "update",
      "content": "Completed user authentication system",
      "userId": "60d5ecb54b24a1234567890a",
      "createdAt": "2023-12-01T10:30:00.000Z",
      "updatedAt": "2023-12-01T10:30:00.000Z"
    }
  ]
}
```

#### Add Project Update
```http
POST /api/projects/:projectId/updates
```

**Request Body:**
```json
{
  "type": "blocker",
  "content": "Facing issues with API integration",
  "blockerType": "Code",
  "blockerDetails": "Third-party API documentation is unclear"
}
```

#### Update Project Update
```http
PUT /api/projects/:projectId/updates/:updateId
```

#### Delete Project Update
```http
DELETE /api/projects/:projectId/updates/:updateId
```

## 📝 Blog Posts

### Get All Blog Posts
```http
GET /api/blog
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "60d5ecb54b24a1234567890f",
      "title": "Getting Started with React Hooks",
      "content": "React Hooks have revolutionized...",
      "excerpt": "Learn the basics of React Hooks",
      "featuredImage": "/uploads/blog/featured-123.jpg",
      "tags": ["React", "JavaScript", "Hooks"],
      "category": "Development",
      "publishedAt": "2023-11-15T10:30:00.000Z",
      "updatedAt": "2023-11-15T10:30:00.000Z",
      "userId": "60d5ecb54b24a1234567890a",
      "status": "published",
      "readingTime": 5,
      "author": {
        "name": "John Doe",
        "avatar": "https://via.placeholder.com/40x40"
      }
    }
  ]
}
```

### Get Single Blog Post
```http
GET /api/blog/:id
```

### Create Blog Post
```http
POST /api/blog
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Full blog post content...",
  "excerpt": "Brief excerpt of the post",
  "featuredImage": "/uploads/blog/image.jpg",
  "tags": ["React", "Tutorial"],
  "category": "Development",
  "status": "published"
}
```

### Update Blog Post
```http
PUT /api/blog/:id
```

### Delete Blog Post
```http
DELETE /api/blog/:id
```

## 🎯 Skills

### Get All Skills
```http
GET /api/skills
```

**Response:**
```json
{
  "skills": [
    {
      "_id": "60d5ecb54b24a1234567890g",
      "name": "React",
      "category": "Frontend Frameworks",
      "experienceLevel": "expert",
      "yearsOfExperience": 5,
      "userId": "60d5ecb54b24a1234567890a",
      "projects": ["60d5ecb54b24a1234567890b"],
      "description": "Extensive experience building React applications",
      "relatedSkills": ["JavaScript", "TypeScript", "Redux"],
      "certifications": ["React Developer Certification"],
      "lastUsed": "2023-12-01T00:00:00.000Z",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-12-01T14:22:00.000Z"
    }
  ]
}
```

### Get Skill Categories
```http
GET /api/skills/categories
```

**Response:**
```json
{
  "categories": [
    "Programming Languages",
    "Frontend Frameworks",
    "Backend Frameworks",
    "Databases",
    "DevOps & Tools",
    "Design & UI/UX",
    "Mobile Development",
    "Cloud Services"
  ]
}
```

### Create Skill
```http
POST /api/skills
```

**Request Body:**
```json
{
  "name": "Vue.js",
  "category": "Frontend Frameworks",
  "experienceLevel": "intermediate",
  "yearsOfExperience": 2,
  "description": "Building reactive web applications",
  "relatedSkills": ["JavaScript", "HTML", "CSS"]
}
```

### Update Skill
```http
PUT /api/skills/:id
```

### Delete Skill
```http
DELETE /api/skills/:id
```

## 🏠 Home Content

### Get Home Content
```http
GET /api/home-content
```

**Response:**
```json
{
  "homeContent": {
    "_id": "60d5ecb54b24a1234567890h",
    "name": "John Doe",
    "tagline": "Full-Stack Developer & Tech Enthusiast",
    "bio": "Passionate developer creating amazing web experiences",
    "profileImageUrl": "/uploads/profile/profile-123.jpg",
    "yearsExperience": 5,
    "coreExpertise": ["React", "Node.js", "MongoDB", "TypeScript"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "website": "https://johndoe.dev"
    },
    "collaboratorStats": {
      "academia": {
        "total": 5,
        "subcategories": {
          "postdoc": 2,
          "junior_faculty": 2,
          "senior_faculty": 1
        }
      },
      "industry": {
        "total": 8,
        "subcategories": {
          "industry_tech": 5,
          "industry_finance": 2,
          "industry_healthcare": 1
        }
      },
      "students": {
        "total": 12,
        "subcategories": {
          "undergraduate": 8,
          "graduate": 4
        }
      },
      "others": {
        "total": 3,
        "subcategories": {
          "professional_ethicist": 2,
          "journalist": 1
        }
      }
    },
    "userId": "60d5ecb54b24a1234567890a",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-12-01T14:22:00.000Z"
  }
}
```

### Update Home Content
```http
PUT /api/home-content
```

**Request Body:**
```json
{
  "name": "John Doe",
  "tagline": "Updated tagline",
  "bio": "Updated bio text",
  "yearsExperience": 6,
  "coreExpertise": ["React", "Node.js", "Python"],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  },
  "collaborators": [
    {
      "name": "Jane Smith",
      "type": "industry_tech"
    }
  ]
}
```

### Get Collaborators Data
```http
GET /api/home-content/collaborators
```

## 👥 Collaborators

### Get All Collaborators
```http
GET /api/collaborators
```

**Response:**
```json
{
  "collaborators": [
    {
      "_id": "60d5ecb54b24a1234567890i",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "type": "industry_tech",
      "institution": "Tech Corp",
      "role": "Senior Developer",
      "profileUrl": "https://linkedin.com/in/janesmith",
      "bio": "Experienced software engineer",
      "skills": ["Python", "Machine Learning", "AWS"],
      "projectIds": ["60d5ecb54b24a1234567890b"],
      "isActive": true,
      "userId": "60d5ecb54b24a1234567890a",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-12-01T14:22:00.000Z"
    }
  ]
}
```

### Get Single Collaborator
```http
GET /api/collaborators/:id
```

### Create Collaborator
```http
POST /api/collaborators
```

**Request Body:**
```json
{
  "name": "New Collaborator",
  "email": "collaborator@example.com",
  "type": "industry_tech",
  "institution": "Tech Company",
  "role": "Developer",
  "bio": "Experienced developer",
  "skills": ["JavaScript", "React"]
}
```

### Update Collaborator
```http
PUT /api/collaborators/:id
```

### Delete Collaborator
```http
DELETE /api/collaborators/:id
```

### Get Collaborator Statistics
```http
GET /api/collaborators/stats/summary
```

## 📁 File Uploads

### Upload Project Image
```http
POST /api/projects/upload
Content-Type: multipart/form-data
```

**Request Body:**
```
image: [file]
```

**Response:**
```json
{
  "imageUrl": "/uploads/projects/image-123456789.jpg"
}
```

### Upload Blog Image
```http
POST /api/blog/upload-image
Content-Type: multipart/form-data
```

**Request Body:**
```
image: [file]
```

### Upload Profile Image
```http
POST /api/home-content/upload-profile-image
Content-Type: multipart/form-data
```

**Request Body:**
```
profileImage: [file]
```

## ❌ Error Handling

### Error Response Format
```json
{
  "error": "Error message describing what went wrong",
  "details": "Additional error details (in development mode)",
  "timestamp": "2023-12-01T14:22:00.000Z"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Validation Errors
```json
{
  "error": "Validation failed",
  "details": {
    "email": "Please enter a valid email address",
    "password": "Password must be at least 8 characters long"
  }
}
```

## 🚦 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **File upload endpoints**: 10 requests per minute
- **General API endpoints**: 100 requests per 15 minutes

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```

## 📊 Pagination

For endpoints that return lists, pagination is supported:

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

### Paginated Response Format
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔍 Filtering and Search

### Query Parameters for Filtering
- `search` - Full-text search across relevant fields
- `category` - Filter by category
- `status` - Filter by status
- `tags` - Filter by tags (comma-separated)
- `dateFrom` - Filter from date (ISO format)
- `dateTo` - Filter to date (ISO format)

### Example
```http
GET /api/projects?search=react&status=completed&tags=javascript,frontend
```

## 📱 API Versioning

The current API version is v1. All endpoints are prefixed with `/api/`.

Future versions will be available at:
- `/api/v2/` - Version 2
- `/api/v3/` - Version 3

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens expire after 15 minutes (access) and 7 days (refresh)
- File uploads are validated for type and size
- SQL injection protection through Mongoose ODM
- CORS configured for specific origins in production
- Helmet.js used for security headers

## 📞 Support

For API support and questions:
- Create an issue on GitHub
- Check the troubleshooting section in the main documentation
- Review error messages and logs for debugging information

---

**API Documentation Version 1.0 - Last Updated: December 2023**