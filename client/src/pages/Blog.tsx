import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Filter,
  X
} from 'lucide-react';
import { getBlogPosts, deleteBlogPost } from '../api/blog';
import { useToast } from '../hooks/useToast';

console.log('Blog Component: Loading...');

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

export function Blog() {
  console.log('Blog Component: Rendering...');

  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    console.log('Blog Component: useEffect triggered for fetchPosts');
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log('Blog Component: useEffect triggered for filtering');
    filterPosts();
  }, [posts, searchTerm, selectedTag]);

  const fetchPosts = async () => {
    console.log('Blog Component: fetchPosts called');
    try {
      console.log('Blog Component: ===== FETCHING BLOG POSTS =====');
      setLoading(true);
      const response = await getBlogPosts();
      console.log('Blog Component: Posts fetched successfully:', response);
      setPosts(response.posts || []);
      console.log('Blog Component: Posts state updated with', response.posts?.length || 0, 'posts');
    } catch (error) {
      console.error('Blog Component: ===== ERROR FETCHING BLOG POSTS =====');
      console.error('Blog Component: Error object:', error);
      console.error('Blog Component: Error message:', error.message);
      console.error('Blog Component: Error stack:', error.stack);
      console.error('Blog Component: ===== END ERROR LOG =====');
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blog posts",
        variant: "destructive",
      });
    } finally {
      console.log('Blog Component: Setting loading to false');
      setLoading(false);
    }
  };

  const filterPosts = () => {
    console.log('Blog Component: filterPosts called with searchTerm:', searchTerm, 'selectedTag:', selectedTag);
    let filtered = posts;

    if (searchTerm) {
      console.log('Blog Component: Filtering by search term:', searchTerm);
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTag) {
      console.log('Blog Component: Filtering by tag:', selectedTag);
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(selectedTag)
      );
    }

    console.log('Blog Component: Filtered posts count:', filtered.length);
    setFilteredPosts(filtered);
  };

  const handleDelete = async (postId: string) => {
    console.log('Blog Component: handleDelete called for post:', postId);
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      console.log('Blog Component: Delete cancelled by user');
      return;
    }

    try {
      console.log('Blog Component: Deleting post:', postId);
      await deleteBlogPost(postId);
      console.log('Blog Component: Post deleted successfully');
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error('Blog Component: Error deleting post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleBlogPostClick = (postId: string) => {
    console.log('Blog Component: Navigating to blog post:', postId);
    navigate(`/blog/${postId}`);
  };

  const getAllTags = () => {
    console.log('Blog Component: getAllTags called');
    const allTags = posts.reduce((tags: string[], post) => {
      if (post.tags) {
        tags.push(...post.tags);
      }
      return tags;
    }, []);
    const uniqueTags = Array.from(new Set(allTags));
    console.log('Blog Component: Unique tags found:', uniqueTags);
    return uniqueTags;
  };

  const getTagCount = (tag: string) => {
    const count = posts.filter(post => post.tags && post.tags.includes(tag)).length;
    console.log('Blog Component: Tag count for', tag, ':', count);
    return count;
  };

  if (loading) {
    console.log('Blog Component: Rendering loading state');
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  console.log('Blog Component: Rendering main blog component with', filteredPosts.length, 'filtered posts');

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="text-gray-600">
            {posts.length} post{posts.length !== 1 ? 's' : ''} published
          </p>
        </div>
        <Button onClick={() => navigate('/blog/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedTag(null);
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Tag Filter */}
        {getAllTags().length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Filter by tag:
            </span>
            {getAllTags().map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag} ({getTagCount(tag)})
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {posts.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
          </h2>
          <p className="text-gray-600 mb-6">
            {posts.length === 0
              ? 'Create your first blog post to get started.'
              : 'Try adjusting your search terms or filters.'
            }
          </p>
          {posts.length === 0 && (
            <Button onClick={() => navigate('/blog/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleBlogPostClick(post._id)}
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onLoad={() => {
                      console.log('Blog Component: Post image loaded:', post.featuredImage);
                    }}
                    onError={(e) => {
                      console.error('Blog Component: Post image failed to load:', post.featuredImage);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-2 cursor-pointer hover:text-blue-600">
                    {post.title}
                  </CardTitle>

                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${post._id}`);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/edit/${post._id}`);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post._id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Read More Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blog/${post._id}`);
                  }}
                  className="w-full"
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Keywords Statistics */}
      {getAllTags().length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {getAllTags()
              .sort((a, b) => getTagCount(b) - getTagCount(a))
              .slice(0, 10)
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag} ({getTagCount(tag)})
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

console.log('Blog Component: Component defined successfully');