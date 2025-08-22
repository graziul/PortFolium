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
  author: {
    name: string;
    avatar: string;
  };
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
// Endpoint: GET /api/blog-posts
// Request: {}
// Response: { posts: BlogPost[] }
export const getBlogPosts = async (): Promise<{ posts: BlogPost[] }> => {
  console.log('BlogAPI: getBlogPosts called');
  console.log('BlogAPI: Checking localStorage tokens...');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  console.log('BlogAPI: refreshToken exists:', !!localStorage.getItem('refreshToken'));
  
  try {
    console.log('BlogAPI: Making GET request to /api/blog-posts');
    const response = await api.get('/api/blog-posts');
    console.log('BlogAPI: getBlogPosts success, response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('BlogAPI: getBlogPosts error:', error);
    console.error('BlogAPI: Error response status:', error?.response?.status);
    console.error('BlogAPI: Error response data:', error?.response?.data);
    console.error('BlogAPI: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single blog post by ID
// Endpoint: GET /api/blog-posts/:id
// Request: {}
// Response: { post: BlogPost }
export const getBlogPost = async (id: string): Promise<{ post: BlogPost }> => {
  console.log('BlogAPI: getBlogPost called with id:', id);
  console.log('BlogAPI: Checking localStorage tokens...');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  
  try {
    console.log('BlogAPI: Making GET request to /api/blog-posts/' + id);
    const response = await api.get(`/api/blog-posts/${id}`);
    console.log('BlogAPI: getBlogPost success, response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('BlogAPI: getBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error?.response?.status);
    console.error('BlogAPI: Error response data:', error?.response?.data);
    console.error('BlogAPI: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new blog post
// Endpoint: POST /api/blog-posts
// Request: CreateBlogPostData
// Response: { post: BlogPost }
export const createBlogPost = async (postData: CreateBlogPostData): Promise<{ post: BlogPost }> => {
  console.log('BlogAPI: createBlogPost called with data:', postData);
  console.log('BlogAPI: Checking localStorage tokens...');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  
  try {
    console.log('BlogAPI: Making POST request to /api/blog-posts');
    const response = await api.post('/api/blog-posts', postData);
    console.log('BlogAPI: createBlogPost success, response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('BlogAPI: createBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error?.response?.status);
    console.error('BlogAPI: Error response data:', error?.response?.data);
    console.error('BlogAPI: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing blog post
// Endpoint: PUT /api/blog-posts/:id
// Request: UpdateBlogPostData
// Response: { post: BlogPost }
export const updateBlogPost = async (id: string, postData: UpdateBlogPostData): Promise<{ post: BlogPost }> => {
  console.log('BlogAPI: updateBlogPost called with id:', id, 'data:', postData);
  console.log('BlogAPI: Checking localStorage tokens...');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  
  try {
    console.log('BlogAPI: Making PUT request to /api/blog-posts/' + id);
    const response = await api.put(`/api/blog-posts/${id}`, postData);
    console.log('BlogAPI: updateBlogPost success, response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('BlogAPI: updateBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error?.response?.status);
    console.error('BlogAPI: Error response data:', error?.response?.data);
    console.error('BlogAPI: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a blog post
// Endpoint: DELETE /api/blog-posts/:id
// Request: {}
// Response: { message: string }
export const deleteBlogPost = async (id: string): Promise<{ message: string }> => {
  console.log('BlogAPI: deleteBlogPost called with id:', id);
  console.log('BlogAPI: Checking localStorage tokens...');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  
  try {
    console.log('BlogAPI: Making DELETE request to /api/blog-posts/' + id);
    const response = await api.delete(`/api/blog-posts/${id}`);
    console.log('BlogAPI: deleteBlogPost success, response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('BlogAPI: deleteBlogPost error:', error);
    console.error('BlogAPI: Error response status:', error?.response?.status);
    console.error('BlogAPI: Error response data:', error?.response?.data);
    console.error('BlogAPI: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload image for blog post
// Endpoint: POST /api/blog-posts/upload-image
// Request: FormData with image file
// Response: { imageUrl: string }
export const uploadBlogImage = async (imageFile: File): Promise<{ imageUrl: string }> => {
  console.log('BlogAPI: uploadBlogImage called with file:', imageFile.name, imageFile.size);
  console.log('BlogAPI: Checking localStorage tokens...');
  console.log('BlogAPI: accessToken exists:', !!localStorage.getItem('accessToken'));
  
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    console.log('BlogAPI: Making POST request to /api/blog-posts/upload-image');
    const response = await api.post('/api/blog-posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('BlogAPI: uploadBlogImage success, response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('BlogAPI: uploadBlogImage error:', error);
    console.error('BlogAPI: Error response status:', error?.response?.status);
    console.error('BlogAPI: Error response data:', error?.response?.data);
    console.error('BlogAPI: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};