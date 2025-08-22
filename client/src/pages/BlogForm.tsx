import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogForm } from '@/components/BlogForm';
import { getBlogPost, BlogPost } from '@/api/blog';
import { useToast } from '@/hooks/useToast';
import { Link } from 'react-router-dom';

export function BlogFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(!!id);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        console.log('BlogFormPage: Fetching blog post for editing:', id);
        const response = await getBlogPost(id);
        setPost(response.post);
        console.log('BlogFormPage: Blog post loaded successfully');
      } catch (error: any) {
        console.error('BlogFormPage: Error loading blog post:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load blog post for editing",
          variant: "destructive",
        });
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, toast]);

  const handleSubmit = (savedPost: BlogPost) => {
    console.log('BlogFormPage: Blog post saved successfully:', savedPost._id);
    navigate(`/blog/${savedPost._id}`);
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <BlogForm
        post={post || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}