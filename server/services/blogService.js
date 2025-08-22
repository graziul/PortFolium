console.log('BlogService: Starting to load BlogService module...');

try {
  const BlogPost = require('../models/BlogPost');
  console.log('BlogService: BlogPost model loaded successfully');
} catch (error) {
  console.error('BlogService: CRITICAL ERROR - Failed to load BlogPost model:', error);
  console.error('BlogService: Error stack:', error.stack);
}

const BlogPost = require('../models/BlogPost');

class BlogService {
  // Get all blog posts for a user
  static async getPostsByUser(userId) {
    console.log('BlogService: ===== getPostsByUser CALLED =====');
    console.log('BlogService: User ID:', userId);
    console.log('BlogService: BlogPost model type:', typeof BlogPost);
    console.log('BlogService: BlogPost.find type:', typeof BlogPost?.find);

    try {
      console.log('BlogService: About to call BlogPost.find');

      if (!BlogPost) {
        console.error('BlogService: CRITICAL - BlogPost model is undefined!');
        throw new Error('BlogPost model not available');
      }

      if (!BlogPost.find) {
        console.error('BlogService: CRITICAL - BlogPost.find is undefined!');
        throw new Error('BlogPost.find method not available');
      }

      const posts = await BlogPost.find({ userId }).sort({ createdAt: -1 });
      console.log('BlogService: BlogPost.find completed successfully');
      console.log('BlogService: Found', posts.length, 'blog posts');

      // Transform posts to match frontend expectations
      const transformedPosts = posts.map(post => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage || '', // Don't use placeholder
        tags: post.tags || [],
        category: post.category,
        publishedAt: post.publishedAt || post.createdAt,
        updatedAt: post.updatedAt,
        userId: post.userId,
        status: post.published ? 'published' : 'draft',
        readingTime: post.readTime || 1,
        author: post.author || {
          name: 'Anonymous',
          avatar: 'https://via.placeholder.com/40x40'
        }
      }));

      return transformedPosts;
    } catch (error) {
      console.error('BlogService: ===== ERROR IN getPostsByUser =====');
      console.error('BlogService: Error type:', error.constructor.name);
      console.error('BlogService: Error message:', error.message);
      console.error('BlogService: Error stack:', error.stack);
      console.error('BlogService: MongoDB connection state:', require('mongoose').connection.readyState);
      console.error('BlogService: ===== END ERROR LOG =====');
      throw error;
    }
  }

  // Get blog post by ID
  static async getPostById(postId, userId) {
    console.log('BlogService: ===== getPostById CALLED =====');
    console.log('BlogService: Post ID:', postId, 'User ID:', userId);

    try {
      const post = await BlogPost.findOne({ _id: postId, userId });
      console.log('BlogService: Blog post found:', !!post);
      
      if (!post) {
        return null;
      }

      // Transform post to match frontend expectations
      const transformedPost = {
        _id: post._id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage || 'https://via.placeholder.com/800x400',
        tags: post.tags || [],
        category: post.category,
        publishedAt: post.publishedAt || post.createdAt,
        updatedAt: post.updatedAt,
        userId: post.userId,
        status: post.published ? 'published' : 'draft',
        readingTime: post.readTime || 1,
        author: post.author || {
          name: 'Anonymous',
          avatar: 'https://via.placeholder.com/40x40'
        }
      };

      return transformedPost;
    } catch (error) {
      console.error('BlogService: ===== ERROR IN getPostById =====');
      console.error('BlogService: Error:', error);
      console.error('BlogService: Error stack:', error.stack);
      console.error('BlogService: ===== END ERROR LOG =====');
      throw error;
    }
  }

  // Create new blog post
  static async createPost(postData) {
    console.log('BlogService: ===== createPost CALLED =====');
    console.log('BlogService: Post data:', postData);

    try {
      // Calculate read time (rough estimate: 200 words per minute)
      const wordCount = postData.content ? postData.content.split(' ').length : 0;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const blogPostData = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        featuredImage: postData.featuredImage || '',
        tags: postData.tags || [],
        category: postData.category,
        readTime,
        published: postData.status === 'published',
        publishedAt: postData.status === 'published' ? new Date() : null,
        userId: postData.userId,
        author: postData.author || {
          name: 'Anonymous',
          avatar: 'https://via.placeholder.com/40x40'
        }
      };

      const post = new BlogPost(blogPostData);
      await post.save();
      console.log('BlogService: Blog post created successfully:', post._id);

      // Transform post to match frontend expectations
      const transformedPost = {
        _id: post._id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage || 'https://via.placeholder.com/400x200',
        tags: post.tags || [],
        category: post.category,
        publishedAt: post.publishedAt || post.createdAt,
        updatedAt: post.updatedAt,
        userId: post.userId,
        status: post.published ? 'published' : 'draft',
        readingTime: post.readTime || 1,
        author: post.author || {
          name: 'Anonymous',
          avatar: 'https://via.placeholder.com/40x40'
        }
      };

      return transformedPost;
    } catch (error) {
      console.error('BlogService: ===== ERROR IN createPost =====');
      console.error('BlogService: Error:', error);
      console.error('BlogService: Error stack:', error.stack);
      console.error('BlogService: ===== END ERROR LOG =====');
      throw error;
    }
  }

  // Update blog post
  static async updatePost(postId, updateData, userId) {
    console.log('BlogService: ===== updatePost CALLED =====');
    console.log('BlogService: Post ID:', postId, 'User ID:', userId);

    try {
      // Recalculate read time if content is updated
      if (updateData.content) {
        const wordCount = updateData.content.split(' ').length;
        updateData.readTime = Math.max(1, Math.ceil(wordCount / 200));
      }

      // Update published date if publishing for the first time
      if (updateData.status === 'published') {
        updateData.published = true;
        if (!updateData.publishedAt) {
          updateData.publishedAt = new Date();
        }
      } else if (updateData.status === 'draft') {
        updateData.published = false;
      }

      const post = await BlogPost.findOneAndUpdate(
        { _id: postId, userId },
        updateData,
        { new: true, runValidators: true }
      );
      console.log('BlogService: Blog post updated:', !!post);

      if (!post) {
        return null;
      }

      // Transform post to match frontend expectations
      const transformedPost = {
        _id: post._id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage || 'https://via.placeholder.com/400x200',
        tags: post.tags || [],
        category: post.category,
        publishedAt: post.publishedAt || post.createdAt,
        updatedAt: post.updatedAt,
        userId: post.userId,
        status: post.published ? 'published' : 'draft',
        readingTime: post.readTime || 1,
        author: post.author || {
          name: 'Anonymous',
          avatar: 'https://via.placeholder.com/40x40'
        }
      };

      return transformedPost;
    } catch (error) {
      console.error('BlogService: ===== ERROR IN updatePost =====');
      console.error('BlogService: Error:', error);
      console.error('BlogService: Error stack:', error.stack);
      console.error('BlogService: ===== END ERROR LOG =====');
      throw error;
    }
  }

  // Delete blog post
  static async deletePost(postId, userId) {
    console.log('BlogService: ===== deletePost CALLED =====');
    console.log('BlogService: Post ID:', postId, 'User ID:', userId);

    try {
      const post = await BlogPost.findOneAndDelete({ _id: postId, userId });
      console.log('BlogService: Blog post deleted:', !!post);
      return post;
    } catch (error) {
      console.error('BlogService: ===== ERROR IN deletePost =====');
      console.error('BlogService: Error:', error);
      console.error('BlogService: Error stack:', error.stack);
      console.error('BlogService: ===== END ERROR LOG =====');
      throw error;
    }
  }
}

console.log('BlogService: Class definition complete');
console.log('BlogService: Available methods:', Object.getOwnPropertyNames(BlogService));

module.exports = { BlogService };
console.log('BlogService: Module export complete');