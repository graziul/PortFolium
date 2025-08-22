import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Tag, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBlogPosts, deleteBlogPost, BlogPost } from '@/api/blog';
import { useToast } from '@/hooks/useToast';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fuse = new Fuse(posts, {
    keys: ['title', 'excerpt', 'tags'],
    threshold: 0.3,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('Blog Component: ===== FETCHING BLOG POSTS =====');
      console.log('Blog Component: Component mounted, starting data fetch');
      console.log('Blog Component: Current auth state - localStorage tokens:');
      console.log('Blog Component: - accessToken exists:', !!localStorage.getItem('accessToken'));
      console.log('Blog Component: - refreshToken exists:', !!localStorage.getItem('refreshToken'));
      
      try {
        console.log('Blog Component: Calling getBlogPosts API...');
        const response = await getBlogPosts();
        console.log('Blog Component: getBlogPosts API call successful');
        console.log('Blog Component: Response received:', response);
        console.log('Blog Component: Number of posts:', response.posts?.length || 0);
        
        setPosts(response.posts);
        setFilteredPosts(response.posts);
        console.log('Blog Component: State updated with posts');
      } catch (error: any) {
        console.error('Blog Component: ===== ERROR FETCHING BLOG POSTS =====');
        console.error('Blog Component: Error object:', error);
        console.error('Blog Component: Error message:', error.message);
        console.error('Blog Component: Error stack:', error.stack);
        console.error('Blog Component: ===== END ERROR LOG =====');
        
        toast({
          title: "Error",
          description: error.message || "Failed to load blog posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        console.log('Blog Component: Setting loading to false');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      filtered = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Apply keyword filter
    if (selectedKeyword) {
      filtered = filtered.filter(post => post.tags.includes(selectedKeyword));
    }

    setFilteredPosts(filtered);
  }, [searchTerm, categoryFilter, selectedKeyword, posts, fuse]);

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    setDeletingId(postId);
    try {
      console.log('Blog Component: Deleting blog post:', postId);
      await deleteBlogPost(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
      console.log('Blog Component: Blog post deleted successfully');
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error: any) {
      console.error('Blog Component: Error deleting blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const categories = [...new Set(posts.map(p => p.category))];

  // Generate keyword statistics
  const keywordStats = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topKeywords = Object.entries(keywordStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 12);

  const keywordColors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  ];

  if (loading) {
    console.log('Blog Component: Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('Blog Component: Rendering main blog component with', filteredPosts.length, 'filtered posts');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blog & Articles
          </h1>
          <Button asChild>
            <Link to="/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Thoughts, tutorials, and insights about web development, design, and technology.
        </p>
      </motion.div>

      {/* Keyword Cloud */}
      {topKeywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-3xl p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Tag className="h-6 w-6" />
              Popular Keywords
            </h2>
            <p className="text-muted-foreground">Click on any keyword to filter articles</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {topKeywords.map(([keyword, count], index) => (
              <motion.button
                key={keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                onClick={() => setSelectedKeyword(selectedKeyword === keyword ? '' : keyword)}
                className={`
                  px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 cursor-pointer
                  ${selectedKeyword === keyword
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : keywordColors[index % keywordColors.length]
                  }
                `}
              >
                {keyword} ({count})
              </motion.button>
            ))}
          </div>

          {selectedKeyword && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <Badge variant="outline" className="text-sm">
                Showing articles tagged with "{selectedKeyword}"
              </Badge>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/80"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-white/80 dark:bg-gray-800/80">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 h-full">
              <div className="aspect-video overflow-hidden">
                {post.featuredImage ? (
                  <img
                    src={`http://localhost:3000${post.featuredImage}`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onLoad={() => {
                      console.log('Blog: ===== IMAGE LOAD SUCCESS =====');
                      console.log('Blog: Image loaded successfully:', `http://localhost:3000${post.featuredImage}`);
                      console.log('Blog: Original featuredImage value:', post.featuredImage);
                      console.log('Blog: ===== END IMAGE LOAD SUCCESS =====');
                    }}
                    onError={(e) => {
                      console.error('Blog: ===== IMAGE LOAD ERROR =====');
                      console.error('Blog: Image failed to load:', `http://localhost:3000${post.featuredImage}`);
                      console.error('Blog: Original featuredImage value:', post.featuredImage);
                      console.error('Blog: Image src attribute:', e.currentTarget.src);
                      console.error('Blog: Image naturalWidth:', e.currentTarget.naturalWidth);
                      console.error('Blog: Image naturalHeight:', e.currentTarget.naturalHeight);
                      console.error('Blog: Image complete:', e.currentTarget.complete);
                      console.error('Blog: ===== END IMAGE LOAD ERROR =====');
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>

              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTime} min</span>
                  </div>
                </div>

                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post._id}`}>
                    {post.title}
                  </Link>
                </CardTitle>

                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 flex-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                          selectedKeyword === tag ? 'bg-primary text-primary-foreground' : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedKeyword(selectedKeyword === tag ? '' : tag);
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/blog/edit/${post._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post._id, post.title)}
                      disabled={deletingId === post._id}
                    >
                      {deletingId === post._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg mb-4">
            {posts.length === 0
              ? "No blog posts yet. Create your first post!"
              : "No articles found matching your criteria."
            }
          </p>
          {posts.length === 0 && (
            <Button asChild>
              <Link to="/blog/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Link>
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}