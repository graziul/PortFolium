import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/api/blog';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
}

export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const handleCardClick = () => {
    console.log('BlogPostCard: Navigating to blog post:', post._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link to={`/blog/${post._id}`} onClick={handleCardClick}>
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 cursor-pointer h-full">
          {/* Featured Image */}
          <div className="aspect-video overflow-hidden relative">
            <img
              src={post.featuredImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              style={{
                minHeight: '200px',
                maxHeight: '200px',
                objectFit: 'cover'
              }}
              onLoad={(e) => {
                const imgElement = e.currentTarget;
                console.log('BlogPostCard: Image loaded successfully:', imgElement.src);
              }}
              onError={(e) => {
                const imgElement = e.currentTarget;
                console.error('BlogPostCard: Image failed to load:', imgElement.src);
                e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop";
              }}
            />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge
                variant={post.status === 'published' ? 'default' : 'secondary'}
                className="bg-white/90 dark:bg-gray-900/90"
              >
                {post.status}
              </Badge>
            </div>

            {/* Featured Badge */}
            {post.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  Featured
                </Badge>
              </div>
            )}
          </div>

          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-3">
                  {post.excerpt || post.content?.substring(0, 150) + '...'}
                </CardDescription>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
              )}
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Category */}
            {post.category && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground capitalize">
                  {post.category}
                </span>
              </div>
            )}

            {/* Read More Button */}
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="group-hover:bg-primary/10 group-hover:text-primary transition-colors w-full justify-between"
              >
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}