import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { getBlogPost, deleteBlogPost } from '../api/blog';
import { useToast } from '../hooks/useToast';

console.log('BlogPostPage: Component loading...');

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export function BlogPostPage() {
  console.log('BlogPostPage: Component rendering...');
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('BlogPostPage: Post ID from params:', id);

  useEffect(() => {
    console.log('BlogPostPage: useEffect triggered with id:', id);
    if (id) {
      fetchPost();
    } else {
      console.error('BlogPostPage: No post ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchPost = async () => {
    console.log('BlogPostPage: fetchPost called');
    if (!id) {
      console.error('BlogPostPage: Cannot fetch post - no ID provided');
      return;
    }

    try {
      console.log('BlogPostPage: Fetching post with ID:', id);
      setLoading(true);
      const response = await getBlogPost(id);
      console.log('BlogPostPage: Post fetched successfully:', response);
      setPost(response.post);
    } catch (error) {
      console.error('BlogPostPage: Error fetching post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blog post",
        variant: "destructive",
      });
    } finally {
      console.log('BlogPostPage: Setting loading to false');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log('BlogPostPage: handleDelete called');
    if (!post || !id) {
      console.error('BlogPostPage: Cannot delete - no post or ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      console.log('BlogPostPage: Delete cancelled by user');
      return;
    }

    try {
      console.log('BlogPostPage: Deleting post with ID:', id);
      await deleteBlogPost(id);
      console.log('BlogPostPage: Post deleted successfully');
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      navigate('/blog');
    } catch (error) {
      console.error('BlogPostPage: Error deleting post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    console.log('BlogPostPage: handleEdit called, navigating to edit page');
    navigate(`/blog/edit/${id}`);
  };

  const handleBack = () => {
    console.log('BlogPostPage: handleBack called, navigating to blog list');
    navigate('/blog');
  };

  if (loading) {
    console.log('BlogPostPage: Rendering loading state');
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading blog post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    console.log('BlogPostPage: Rendering not found state');
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  console.log('BlogPostPage: Rendering blog post:', post.title);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Blog Post Content */}
        <Card>
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log('BlogPostPage: Featured image loaded successfully');
                }}
                onError={(e) => {
                  console.error('BlogPostPage: Featured image failed to load:', post.featuredImage);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </CardTitle>
            
            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.updatedAt !== post.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-4 mb-6">
                {post.excerpt}
              </p>
            )}
          </CardHeader>

          <CardContent>
            {/* Blog Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

console.log('BlogPostPage: Component defined successfully');