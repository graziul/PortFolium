import api from './api';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  tags: string[];
  category: string;
  publishedAt: string;
  updatedAt: string;
  userId: string;
  status: 'draft' | 'published';
  readingTime: number;
}

export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {}

// Description: Get all blog posts for the current user
// Endpoint: GET /api/blog
// Request: {}
// Response: { posts: BlogPost[] }
export const getBlogPosts = async (): Promise<{ posts: BlogPost[] }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        posts: [
          {
            _id: '1',
            title: 'Getting Started with React',
            content: 'React is a powerful JavaScript library...',
            excerpt: 'Learn the basics of React development',
            featuredImage: 'https://via.placeholder.com/400x200',
            tags: ['React', 'JavaScript', 'Frontend'],
            category: 'Development',
            publishedAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            userId: 'user123',
            status: 'published',
            readingTime: 5
          },
          {
            _id: '2',
            title: 'Advanced TypeScript Patterns',
            content: 'TypeScript offers many advanced features...',
            excerpt: 'Explore advanced TypeScript patterns and techniques',
            featuredImage: 'https://via.placeholder.com/400x200',
            tags: ['TypeScript', 'JavaScript', 'Programming'],
            category: 'Development',
            publishedAt: '2024-01-10T14:30:00Z',
            updatedAt: '2024-01-10T14:30:00Z',
            userId: 'user123',
            status: 'published',
            readingTime: 8
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/blog');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get a single blog post by ID
// Endpoint: GET /api/blog/:id
// Request: {}
// Response: BlogPost
export const getBlogPost = async (id: string): Promise<BlogPost> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        title: 'Sample Blog Post',
        content: 'This is the full content of the blog post...',
        excerpt: 'This is a sample blog post excerpt',
        featuredImage: 'https://via.placeholder.com/800x400',
        tags: ['Sample', 'Blog'],
        category: 'General',
        publishedAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        userId: 'user123',
        status: 'published',
        readingTime: 5
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/blog/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create a new blog post
// Endpoint: POST /api/blog
// Request: CreateBlogPostData
// Response: BlogPost
export const createBlogPost = async (postData: CreateBlogPostData): Promise<BlogPost> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: Date.now().toString(),
        ...postData,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user123',
        readingTime: Math.ceil(postData.content.split(' ').length / 200)
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/blog', postData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update an existing blog post
// Endpoint: PUT /api/blog/:id
// Request: UpdateBlogPostData
// Response: BlogPost
export const updateBlogPost = async (id: string, postData: UpdateBlogPostData): Promise<BlogPost> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        title: postData.title || 'Updated Post',
        content: postData.content || 'Updated content',
        excerpt: postData.excerpt || 'Updated excerpt',
        featuredImage: postData.featuredImage,
        tags: postData.tags || [],
        category: postData.category || 'General',
        publishedAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
        userId: 'user123',
        status: postData.status || 'published',
        readingTime: Math.ceil((postData.content?.split(' ').length || 100) / 200)
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/blog/${id}`, postData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete a blog post
// Endpoint: DELETE /api/blog/:id
// Request: {}
// Response: { message: string }
export const deleteBlogPost = async (id: string): Promise<{ message: string }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Blog post deleted successfully' });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/blog/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Upload image for blog post
// Endpoint: POST /api/blog/upload-image
// Request: FormData with image file
// Response: { imageUrl: string }
export const uploadBlogImage = async (imageFile: File): Promise<{ imageUrl: string }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ imageUrl: 'https://via.placeholder.com/800x400' });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const formData = new FormData();
  //   formData.append('image', imageFile);
  //   return await api.post('/api/blog/upload-image', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};