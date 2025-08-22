import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, X, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBlogPost, updateBlogPost, uploadBlogImage, BlogPost, CreateBlogPostData, UpdateBlogPostData } from '@/api/blog';
import { useToast } from '@/hooks/useToast';

interface BlogFormProps {
  post?: BlogPost;
  onSubmit: (post: BlogPost) => void;
  onCancel: () => void;
}

export function BlogForm({ post, onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState<CreateBlogPostData>({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featuredImage: post?.featuredImage || '',
    tags: post?.tags || [],
    category: post?.category || '',
    status: post?.status || 'draft'
  });
  
  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(post?.featuredImage || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Development', 'Design', 'Technology', 'Tutorial', 'Opinion', 'News', 'General'
  ];

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage || '',
        tags: post.tags,
        category: post.category,
        status: post.status
      });
      setImagePreview(post.featuredImage || '');
    }
  }, [post]);

  const handleInputChange = (field: keyof CreateBlogPostData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      console.log('BlogForm: ===== IMAGE UPLOAD STARTED =====');
      console.log('BlogForm: File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      const response = await uploadBlogImage(file);
      const imageUrl = response.imageUrl;

      console.log('BlogForm: Upload response:', response);
      console.log('BlogForm: Image URL received:', imageUrl);

      // Store the relative URL in form data (for saving to database)
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
      
      // For preview, use the absolute URL pointing to backend
      const absoluteImageUrl = `http://localhost:3000${imageUrl}`;
      console.log('BlogForm: Setting preview to absolute URL:', absoluteImageUrl);
      setImagePreview(absoluteImageUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error('BlogForm: ===== IMAGE UPLOAD ERROR =====');
      console.error('BlogForm: Error uploading image:', error);
      console.error('BlogForm: Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('BlogForm: ===== FILE SELECTED =====');
      console.log('BlogForm: Selected file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      setImageFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      console.log('BlogForm: Created preview URL:', previewUrl);
      setImagePreview(previewUrl);

      // Upload immediately
      handleImageUpload(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Require featured image for new posts
    if (!post && !formData.featuredImage.trim()) {
      toast({
        title: "Error",
        description: "Please upload a featured image for your blog post",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      console.log('BlogForm: Submitting blog post...');
      let response;
      
      if (post) {
        console.log('BlogForm: Updating existing post:', post._id);
        response = await updateBlogPost(post._id, formData as UpdateBlogPostData);
      } else {
        console.log('BlogForm: Creating new post');
        response = await createBlogPost(formData);
      }
      
      console.log('BlogForm: Blog post saved successfully');
      toast({
        title: "Success",
        description: post ? "Blog post updated successfully" : "Blog post created successfully",
      });
      
      onSubmit(response.post);
    } catch (error: any) {
      console.error('BlogForm: Error saving blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {post ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image">Featured Image</Label>
                    <div className="space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Uploading image...
                        </div>
                      )}
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview('');
                              handleInputChange('featuredImage', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={12}
                  required
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer">
                        {tag}
                        <X
                          className="h-3 w-3 ml-1"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {post ? 'Update Post' : 'Create Post'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-md"
                  />
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{formData.category}</Badge>
                  <Badge variant={formData.status === 'published' ? 'default' : 'outline'}>
                    {formData.status}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold">{formData.title}</h1>
                <p className="text-lg text-muted-foreground">{formData.excerpt}</p>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br />') }} />
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}