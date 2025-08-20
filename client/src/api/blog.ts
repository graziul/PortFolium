import api from './api';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  tags: string[];
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Description: Upload an image for a blog post
// Endpoint: POST /api/blog-posts/upload
// Request: FormData with 'image' file
// Response: { imageUrl: string }
export const uploadBlogImage = async (file: File) => {
  console.log('BlogAPI: uploadBlogImage called with file:', file.name, file.size);

  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/api/blog-posts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('BlogAPI: uploadBlogImage response:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: uploadBlogImage error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }

  // Mocking the response (commented out for production)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const mockUrl = `/uploads/blog/${Date.now()}-${file.name}`;
  //     console.log('BlogAPI: uploadBlogImage mock response:', mockUrl);
  //     resolve({ imageUrl: mockUrl });
  //   }, 1000);
  // });
};

// Description: Get all blog posts for the authenticated user
// Endpoint: GET /api/blog-posts
// Request: {}
// Response: { posts: BlogPost[] }
export const getBlogPosts = async () => {
  console.log('BlogAPI: getBlogPosts called');

  try {
    const response = await api.get('/api/blog-posts');
    console.log('BlogAPI: getBlogPosts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: getBlogPosts error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }

  // Mocking the response (commented out for production)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const mockPosts = [
  //       {
  //         _id: '1',
  //         title: 'Getting Started with React',
  //         content: 'React is a popular JavaScript library...',
  //         excerpt: 'Learn the basics of React development',
  //         imageUrl: '/uploads/blog/react-post.jpg',
  //         tags: ['React', 'JavaScript', 'Web Development'],
  //         published: true,
  //         userId: 'user1',
  //         createdAt: '2024-01-15T10:00:00Z',
  //         updatedAt: '2024-01-20T15:30:00Z'
  //       },
  //       {
  //         _id: '2',
  //         title: 'Node.js Best Practices',
  //         content: 'When building Node.js applications...',
  //         excerpt: 'Essential tips for Node.js development',
  //         tags: ['Node.js', 'Backend', 'JavaScript'],
  //         published: true,
  //         userId: 'user1',
  //         createdAt: '2024-02-01T09:00:00Z',
  //         updatedAt: '2024-02-10T14:20:00Z'
  //       }
  //     ];
  //     console.log('BlogAPI: getBlogPosts mock response:', mockPosts.length, 'posts');
  //     resolve({ posts: mockPosts });
  //   }, 500);
  // });
};

// Description: Get a single blog post by ID
// Endpoint: GET /api/blog-posts/:id
// Request: {}
// Response: { post: BlogPost }
export const getBlogPost = async (id: string) => {
  console.log('BlogAPI: getBlogPost called with id:', id);

  try {
    const response = await api.get(`/api/blog-posts/${id}`);
    console.log('BlogAPI: getBlogPost response:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: getBlogPost error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }

  // Mocking the response (commented out for production)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const mockPost = {
  //       _id: id,
  //       title: 'Sample Blog Post',
  //       content: 'This is a sample blog post content...',
  //       excerpt: 'Sample excerpt',
  //       imageUrl: '/uploads/blog/sample.jpg',
  //       tags: ['Sample', 'Blog'],
  //       published: true,
  //       userId: 'user1',
  //       createdAt: '2024-01-01T00:00:00Z',
  //       updatedAt: '2024-01-01T00:00:00Z'
  //     };
  //     console.log('BlogAPI: getBlogPost mock response for id:', id, mockPost);
  //     resolve({ post: mockPost });
  //   }, 500);
  // });
};

// Description: Create a new blog post
// Endpoint: POST /api/blog-posts
// Request: { title: string, content: string, excerpt: string, imageUrl?: string, tags: string[], published: boolean }
// Response: { post: BlogPost, message: string }
export const createBlogPost = async (postData: Omit<BlogPost, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  console.log('BlogAPI: createBlogPost called with data:', postData);

  try {
    const response = await api.post('/api/blog-posts', postData);
    console.log('BlogAPI: createBlogPost response:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: createBlogPost error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }

  // Mocking the response (commented out for production)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const newPost = {
  //       ...postData,
  //       _id: Date.now().toString(),
  //       userId: 'user1',
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString()
  //     };
  //     console.log('BlogAPI: createBlogPost mock response:', newPost);
  //     resolve({ post: newPost, message: 'Blog post created successfully' });
  //   }, 1000);
  // });
};

// Description: Update an existing blog post
// Endpoint: PUT /api/blog-posts/:id
// Request: { title?: string, content?: string, excerpt?: string, imageUrl?: string, tags?: string[], published?: boolean }
// Response: { post: BlogPost, message: string }
export const updateBlogPost = async (id: string, postData: Partial<Omit<BlogPost, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
  console.log('BlogAPI: updateBlogPost called with id:', id, 'data:', postData);

  try {
    const response = await api.put(`/api/blog-posts/${id}`, postData);
    console.log('BlogAPI: updateBlogPost response:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: updateBlogPost error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }

  // Mocking the response (commented out for production)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     const updatedPost = {
  //       _id: id,
  //       title: 'Updated Post',
  //       content: 'Updated content',
  //       excerpt: 'Updated excerpt',
  //       tags: ['Updated'],
  //       published: true,
  //       userId: 'user1',
  //       createdAt: '2024-01-01T00:00:00Z',
  //       updatedAt: new Date().toISOString(),
  //       ...postData
  //     };
  //     console.log('BlogAPI: updateBlogPost mock response:', updatedPost);
  //     resolve({ post: updatedPost, message: 'Blog post updated successfully' });
  //   }, 1000);
  // });
};

// Description: Delete a blog post
// Endpoint: DELETE /api/blog-posts/:id
// Request: {}
// Response: { message: string }
export const deleteBlogPost = async (id: string) => {
  console.log('BlogAPI: deleteBlogPost called with id:', id);

  try {
    const response = await api.delete(`/api/blog-posts/${id}`);
    console.log('BlogAPI: deleteBlogPost response:', response.data);
    return response.data;
  } catch (error) {
    console.error('BlogAPI: deleteBlogPost error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }

  // Mocking the response (commented out for production)
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     console.log('BlogAPI: deleteBlogPost mock response for id:', id);
  //     resolve({ message: 'Blog post deleted successfully' });
  //   }, 500);
  // });
};