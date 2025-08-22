import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogPost, deleteBlogPost, BlogPost } from '@/api/blog';
import { useToast } from '@/hooks/useToast';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        console.log('BlogPost: Fetching blog post:', id);
        const response = await getBlogPost(id);
        setPost(response.post);
        console.log('BlogPost: Blog post loaded successfully');
      } catch (error: any) {
        console.error('BlogPost: Error loading blog post:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load blog post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, toast]);

  const handleDeletePost = async () => {
    if (!post || !confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      console.log('BlogPost: Deleting blog post:', post._id);
      await deleteBlogPost(post._id);
      console.log('BlogPost: Blog post deleted successfully');
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      navigate('/blog');
    } catch (error: any) {
      console.error('BlogPost: Error deleting blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button variant="ghost" asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </motion.div>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-6"
      >
        <div className="aspect-video overflow-hidden rounded-2xl">
          {post.featuredImage ? (
            <img
              src={`http://localhost:3000${post.featuredImage}`}
              alt={post.title}
              className="w-full h-full object-cover"
              onLoad={() => console.log('BlogPost: Image loaded successfully:', `http://localhost:3000${post.featuredImage}`)}
              onError={(e) => {
                console.error('BlogPost: Image failed to load:', `http://localhost:3000${post.featuredImage}`);
                console.error('BlogPost: Image error event:', e);
                console.error('BlogPost: Image src attribute:', e.currentTarget.src);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center rounded-2xl">
              <span className="text-gray-400 text-lg">No featured image</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{post.category}</Badge>
            <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
              {post.status}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

          <p className="text-xl text-muted-foreground">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/blog/edit/${post._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeletePost}
                disabled={deleting}
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap gap-2"
      >
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </motion.div>
    </div>
  );
}