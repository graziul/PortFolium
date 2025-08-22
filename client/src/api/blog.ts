import api from './api';

console.log('BlogAPI: Module loading...');

// Description: Get all blog posts for the authenticated user
// Endpoint: GET /api/blog-posts
// Request: {}
// Response: { posts: BlogPost[] }
export const getBlogPosts = async () => {
  console.log('BlogAPI: getBlogPosts called');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  console.log('BlogAPI: refreshToken exists:', !!localStorage.getItem('refreshToken'));
  
  try {
    console.log('BlogAPI: Making GET request to /api/blog-posts');
    const response = await api.get('/api/blog-posts');
    console.log('BlogAPI: getBlogPosts response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: getBlogPosts error:', error);
    console.error('BlogAPI: Error response status:', error.response?.status);
    console.error('BlogAPI: Error response data:', error.response?.data);
    console.error('BlogAPI: Error message:', error.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single blog post by ID
// Endpoint: GET /api/blog-posts/:id
// Request: {}
// Response: { post: BlogPost }
export const getBlogPost = async (id: string) => {
  console.log('BlogAPI: getBlogPost called with ID:', id);
  
  try {
    console.log('BlogAPI: Making GET request to /api/blog-posts/' + id);
    const response = await api.get(`/api/blog-posts/${id}`);
    console.log('BlogAPI: getBlogPost response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: getBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error.response?.status);
    console.error('BlogAPI: Error response data:', error.response?.data);
    console.error('BlogAPI: Error message:', error.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new blog post
// Endpoint: POST /api/blog-posts
// Request: { title: string, content: string, excerpt?: string, tags?: string[], featuredImage?: string }
// Response: { post: BlogPost, message: string }
export const createBlogPost = async (postData: {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  featuredImage?: string;
}) => {
  console.log('BlogAPI: createBlogPost called with data:', postData);
  
  try {
    console.log('BlogAPI: Making POST request to /api/blog-posts');
    const response = await api.post('/api/blog-posts', postData);
    console.log('BlogAPI: createBlogPost response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: createBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error.response?.status);
    console.error('BlogAPI: Error response data:', error.response?.data);
    console.error('BlogAPI: Error message:', error.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing blog post
// Endpoint: PUT /api/blog-posts/:id
// Request: { title?: string, content?: string, excerpt?: string, tags?: string[], featuredImage?: string }
// Response: { post: BlogPost, message: string }
export const updateBlogPost = async (id: string, postData: {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  featuredImage?: string;
}) => {
  console.log('BlogAPI: updateBlogPost called with ID:', id, 'and data:', postData);
  
  try {
    console.log('BlogAPI: Making PUT request to /api/blog-posts/' + id);
    const response = await api.put(`/api/blog-posts/${id}`, postData);
    console.log('BlogAPI: updateBlogPost response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: updateBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error.response?.status);
    console.error('BlogAPI: Error response data:', error.response?.data);
    console.error('BlogAPI: Error message:', error.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a blog post
// Endpoint: DELETE /api/blog-posts/:id
// Request: {}
// Response: { message: string }
export const deleteBlogPost = async (id: string) => {
  console.log('BlogAPI: deleteBlogPost called with ID:', id);
  
  try {
    console.log('BlogAPI: Making DELETE request to /api/blog-posts/' + id);
    const response = await api.delete(`/api/blog-posts/${id}`);
    console.log('BlogAPI: deleteBlogPost response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: deleteBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error.response?.status);
    console.error('BlogAPI: Error response data:', error.response?.data);
    console.error('BlogAPI: Error message:', error.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload blog image
// Endpoint: POST /api/blog-posts/upload-image
// Request: FormData with 'image' file
// Response: { imageUrl: string }
export const uploadBlogImage = async (file: File) => {
  console.log('BlogAPI: uploadBlogImage called with file:', file.name);
  
  try {
    console.log('BlogAPI: Creating FormData for image upload');
    const formData = new FormData();
    formData.append('image', file);
    
    console.log('BlogAPI: Making POST request to /api/blog-posts/upload-image');
    const response = await api.post('/api/blog-posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('BlogAPI: uploadBlogImage response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: uploadBlogImage error:', error);
    console.error('BlogAPI: Error response status:', error.response?.status);
    console.error('BlogAPI: Error response data:', error.response?.data);
    console.error('BlogAPI: Error message:', error.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

console.log('BlogAPI: Module loaded successfully');