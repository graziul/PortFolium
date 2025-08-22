import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload, Plus } from 'lucide-react';
import { createProject, updateProject, getProject, uploadProjectImage } from '@/api/projects';
import { toast } from 'sonner';

interface ProjectFormData {
  title: string;
  description: string;
  shortDescription: string;
  status: 'researching' | 'planning' | 'in-progress' | 'completed' | 'on-hold';
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  paperUrl: string;
  thumbnailUrl: string;
  bannerUrl: string;
  archived: boolean;
  featured: boolean;
  startDate: string;
  endDate: string;
  openToCollaborators: boolean;
  acceptingSponsors: boolean;
  collaboratorCount: number;
}

export const ProjectForm = () => {
  console.log('ProjectForm: Component mounting/rendering');

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  console.log('ProjectForm: Mode:', isEditing ? 'editing' : 'creating', 'ID:', id);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    shortDescription: '',
    status: 'planning',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    paperUrl: '',
    thumbnailUrl: '',
    bannerUrl: '',
    archived: false,
    featured: false,
    startDate: '',
    endDate: '',
    openToCollaborators: false,
    acceptingSponsors: false,
    collaboratorCount: 1
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      console.log('ProjectForm: Fetching project data for editing, ID:', id);
      fetchProject(id);
    }
  }, [isEditing, id]);

  const fetchProject = async (projectId: string) => {
    console.log('ProjectForm: fetchProject called with ID:', projectId);
    try {
      setLoading(true);
      const response = await getProject(projectId);
      console.log('ProjectForm: Project data fetched:', response);

      if (response.project) {
        setFormData({
          title: response.project.title || '',
          description: response.project.description || '',
          shortDescription: response.project.shortDescription || '',
          status: response.project.status || 'planning',
          technologies: response.project.technologies || [],
          liveUrl: response.project.liveUrl || '',
          githubUrl: response.project.githubUrl || '',
          paperUrl: response.project.paperUrl || '',
          thumbnailUrl: response.project.thumbnailUrl || '',
          bannerUrl: response.project.bannerUrl || '',
          archived: response.project.archived || false,
          featured: response.project.featured || false,
          startDate: response.project.startDate ? response.project.startDate.split('T')[0] : '',
          endDate: response.project.endDate ? response.project.endDate.split('T')[0] : '',
          openToCollaborators: response.project.openToCollaborators || false,
          acceptingSponsors: response.project.acceptingSponsors || false,
          collaboratorCount: response.project.collaboratorCount || 1
        });
        console.log('ProjectForm: Form data set from project:', formData);
      }
    } catch (error) {
      console.error('ProjectForm: Error fetching project:', error);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string | boolean | number) => {
    console.log('ProjectForm: Input change:', field, '=', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTechnology = () => {
    console.log('ProjectForm: Adding technology:', newTechnology);
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
      console.log('ProjectForm: Technology added, new list:', [...formData.technologies, newTechnology.trim()]);
    } else {
      console.log('ProjectForm: Technology not added - empty or duplicate');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    console.log('ProjectForm: Removing technology:', tech);
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'thumbnail' | 'banner') => {
    console.log('ProjectForm: Image upload triggered for:', imageType);
    const file = event.target.files?.[0];
    if (!file) {
      console.log('ProjectForm: No file selected');
      return;
    }

    console.log('ProjectForm: File selected:', file.name, file.size, file.type);

    try {
      if (imageType === 'thumbnail') {
        setThumbnailUploading(true);
      } else {
        setBannerUploading(true);
      }

      console.log('ProjectForm: Starting image upload...');
      const response = await uploadProjectImage(file);
      console.log('ProjectForm: Image upload response:', response);

      if (response.imageUrl) {
        const fieldName = imageType === 'thumbnail' ? 'thumbnailUrl' : 'bannerUrl';
        console.log('ProjectForm: Setting image URL for', fieldName, ':', response.imageUrl);

        setFormData(prev => ({
          ...prev,
          [fieldName]: response.imageUrl
        }));

        console.log('ProjectForm: Image URL set successfully');
        toast.success(`${imageType} uploaded successfully`);

        // Test if image can be loaded
        const img = new Image();
        img.onload = () => {
          console.log('ProjectForm: Image preview loaded successfully:', response.imageUrl);
        };
        img.onerror = (error) => {
          console.error('ProjectForm: Image preview failed to load:', response.imageUrl, error);
        };
        img.src = response.imageUrl;
      }
    } catch (error) {
      console.error('ProjectForm: Error uploading image:', error);
      toast.error(`Failed to upload ${imageType}`);
    } finally {
      if (imageType === 'thumbnail') {
        setThumbnailUploading(false);
      } else {
        setBannerUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProjectForm: Form submission started');
    console.log('ProjectForm: Form data:', formData);

    if (!formData.title.trim() || !formData.description.trim()) {
      console.log('ProjectForm: Validation failed - missing required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      console.log('ProjectForm: Submitting form data...');

      const submitData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      };

      if (isEditing && id) {
        console.log('ProjectForm: Updating existing project:', id);
        const response = await updateProject(id, submitData);
        console.log('ProjectForm: Update response:', response);
        toast.success('Project updated successfully');
      } else {
        console.log('ProjectForm: Creating new project');
        const response = await createProject(submitData);
        console.log('ProjectForm: Create response:', response);
        toast.success('Project created successfully');
      }

      console.log('ProjectForm: Navigating back to projects page');
      navigate('/projects');
    } catch (error) {
      console.error('ProjectForm: Error submitting form:', error);
      toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('ProjectForm: Cancel button clicked, navigating back');
    navigate('/projects');
  };

  if (loading && isEditing) {
    console.log('ProjectForm: Rendering loading state');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading project data...</div>
        </div>
      </div>
    );
  }

  console.log('ProjectForm: Rendering form with data:', formData);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update your project details' : 'Add a new project to your portfolio'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="researching">Researching</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description for cards and previews"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed project description"
                rows={4}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                />
                <Button type="button" onClick={handleAddTechnology} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* URLs - Updated to include all three link types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Demo URL</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                  placeholder="https://your-demo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">Code URL</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paperUrl">Paper URL</Label>
                <Input
                  id="paperUrl"
                  type="url"
                  value={formData.paperUrl}
                  onChange={(e) => handleInputChange('paperUrl', e.target.value)}
                  placeholder="https://arxiv.org/abs/..."
                />
              </div>
            </div>

            {/* Images - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail Image */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Or enter image URL"
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                  />
                  <div className="flex items-center gap-4">
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'thumbnail')}
                      disabled={thumbnailUploading}
                      className="flex-1"
                    />
                    {thumbnailUploading && (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                  {formData.thumbnailUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail preview"
                        className="max-w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Image */}
              <div className="space-y-2">
                <Label htmlFor="banner">Banner Image</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Or enter image URL"
                    value={formData.bannerUrl}
                    onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                  />
                  <div className="flex items-center gap-4">
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'banner')}
                      disabled={bannerUploading}
                      className="flex-1"
                    />
                    {bannerUploading && (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                  {formData.bannerUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.bannerUrl}
                        alt="Banner preview"
                        className="max-w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked as boolean)}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openToCollaborators"
                    checked={formData.openToCollaborators}
                    onCheckedChange={(checked) => handleInputChange('openToCollaborators', checked as boolean)}
                  />
                  <Label htmlFor="openToCollaborators">Open to Collaborators</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptingSponsors"
                    checked={formData.acceptingSponsors}
                    onCheckedChange={(checked) => handleInputChange('acceptingSponsors', checked as boolean)}
                  />
                  <Label htmlFor="acceptingSponsors">Accepting Sponsors</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="archived"
                    checked={formData.archived}
                    onCheckedChange={(checked) => handleInputChange('archived', checked as boolean)}
                  />
                  <Label htmlFor="archived">Archive this project</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collaboratorCount">Collaborator Count</Label>
                <Input
                  id="collaboratorCount"
                  type="number"
                  min="1"
                  value={formData.collaboratorCount}
                  onChange={(e) => handleInputChange('collaboratorCount', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading || thumbnailUploading || bannerUploading} className="flex-1">
                {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};