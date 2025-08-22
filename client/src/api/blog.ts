import api from './api';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  readTime: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAPI {
  getBlogPosts: () => Promise<{ posts: BlogPost[] }>;
  getBlogPost: (id: string) => Promise<{ post: BlogPost }>;
  createBlogPost: (postData: Partial<BlogPost>) => Promise<{ post: BlogPost; message: string }>;
  updateBlogPost: (id: string, postData: Partial<BlogPost>) => Promise<{ post: BlogPost; message: string }>;
  deleteBlogPost: (id: string) => Promise<{ message: string }>;
  uploadBlogImage: (file: File) => Promise<{ imageUrl: string }>;
}

// Description: Get all blog posts
// Endpoint: GET /api/blog
// Request: {}
// Response: { posts: Array<BlogPost> }
export const getBlogPosts = async () => {
  console.log('BlogAPI: getBlogPosts called');
  
  try {
    const response = await api.get('/api/blog');
    console.log('BlogAPI: Blog posts fetched successfully:', response.data.posts.length);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: Error fetching blog posts:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single blog post by ID
// Endpoint: GET /api/blog/:id
// Request: { id: string }
// Response: { post: BlogPost }
export const getBlogPost = async (id: string) => {
  console.log('BlogAPI: getBlogPost called with id:', id);
  
  try {
    const response = await api.get(`/api/blog/${id}`);
    console.log('BlogAPI: Blog post fetched successfully');
    return response.data;
  } catch (error) {
    console.error('BlogAPI: Error fetching blog post:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new blog post
// Endpoint: POST /api/blog
// Request: { title: string, content: string, excerpt?: string, featuredImage?: string, tags?: string[], published?: boolean }
// Response: { post: BlogPost, message: string }
export const createBlogPost = async (postData: Partial<BlogPost>) => {
  console.log('BlogAPI: createBlogPost called with data:', postData);
  
  try {
    const response = await api.post('/api/blog', postData);
    console.log('BlogAPI: Blog post created successfully');
    return response.data;
  } catch (error) {
    console.error('BlogAPI: Error creating blog post:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update a blog post
// Endpoint: PUT /api/blog/:id
// Request: { id: string, updates: Partial<BlogPost> }
// Response: { post: BlogPost, message: string }
export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  console.log('BlogAPI: updateBlogPost called with id:', id, 'updates:', updates);
  
  try {
    const response = await api.put(`/api/blog/${id}`, updates);
    console.log('BlogAPI: Blog post updated successfully');
    return response.data;
  } catch (error) {
    console.error('BlogAPI: Error updating blog post:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a blog post
// Endpoint: DELETE /api/blog/:id
// Request: { id: string }
// Response: { message: string }
export const deleteBlogPost = async (id: string) => {
  console.log('BlogAPI: deleteBlogPost called with id:', id);
  
  try {
    const response = await api.delete(`/api/blog/${id}`);
    console.log('BlogAPI: Blog post deleted successfully');
    return response.data;
  } catch (error) {
    console.error('BlogAPI: Error deleting blog post:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload an image for blog post
// Endpoint: POST /api/blog/upload
// Request: FormData with 'image' field
// Response: { imageUrl: string }
export const uploadBlogImage = async (file: File) => {
  console.log('BlogAPI: uploadBlogImage called with file:', file.name);
  
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/blog/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('BlogAPI: Image uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('BlogAPI: Error uploading image:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

export const blogAPI: BlogAPI = {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage,
};