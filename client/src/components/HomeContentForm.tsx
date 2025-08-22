import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, User, Plus, Trash2 } from 'lucide-react';
import { getHomeContent, updateHomeContent, uploadProfileImage, getCollaborators, HomeContent, Collaborator } from '@/api/homeContent';
import { getSkills } from '@/api/skills';
import { useToast } from '@/hooks/useToast';

interface HomeContentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const collaboratorTypes = [
  { value: 'postdoc', label: 'Postdoc', category: 'academia' },
  { value: 'junior_faculty', label: 'Junior Faculty', category: 'academia' },
  { value: 'senior_faculty', label: 'Senior Faculty', category: 'academia' },
  { value: 'industry_tech', label: 'Industry - Tech', category: 'industry' },
  { value: 'industry_finance', label: 'Industry - Finance', category: 'industry' },
  { value: 'industry_healthcare', label: 'Industry - Healthcare', category: 'industry' },
  { value: 'undergraduate', label: 'Undergraduate Student', category: 'students' },
  { value: 'graduate', label: 'Graduate Student', category: 'students' },
  { value: 'professional_ethicist', label: 'Professional Ethicist', category: 'others' },
  { value: 'journalist', label: 'Journalist', category: 'others' }
];

export function HomeContentForm({ onSuccess, onCancel }: HomeContentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<HomeContent>>({
    name: '',
    tagline: '',
    bio: '',
    headerText: 'Stellar Codex',
    profileImageUrl: '',
    yearsExperience: 0,
    coreExpertise: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  });
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newCollaborator, setNewCollaborator] = useState<Collaborator>({
    name: '',
    type: 'postdoc'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('HomeContentForm: Loading home content, collaborators, and skills...');

      const [homeContentResponse, collaboratorsResponse, skillsResponse] = await Promise.all([
        getHomeContent().catch(error => {
          console.log('HomeContentForm: Home content not found, using defaults');
          return {
            homeContent: {
              name: '',
              tagline: '',
              bio: '',
              headerText: 'Stellar Codex',
              profileImageUrl: '',
              yearsExperience: 0,
              coreExpertise: [],
              socialLinks: {
                linkedin: '',
                github: '',
                twitter: '',
                website: ''
              }
            }
          };
        }),
        getCollaborators().catch(error => {
          console.log('HomeContentForm: Collaborators not found, using empty array');
          return { collaborators: [] };
        }),
        getSkills().catch(error => {
          console.log('HomeContentForm: Skills not found, using empty array');
          return { skills: [] };
        })
      ]);

      setFormData(homeContentResponse.homeContent);
      setCollaborators(collaboratorsResponse.collaborators);
      setSkills(skillsResponse.skills || []);
      console.log('HomeContentForm: Data loaded successfully');
    } catch (error) {
      console.error('HomeContentForm: Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data.',
        variant: 'destructive'
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('socialLinks.')) {
      const socialField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSkillAsExpertise = (skillName: string) => {
    if (!formData.coreExpertise?.includes(skillName)) {
      setFormData(prev => ({
        ...prev,
        coreExpertise: [...(prev.coreExpertise || []), skillName]
      }));
      console.log('HomeContentForm: Added skill as expertise:', skillName);
    }
  };

  const removeExpertise = (expertiseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      coreExpertise: prev.coreExpertise?.filter(expertise => expertise !== expertiseToRemove) || []
    }));
    console.log('HomeContentForm: Removed expertise:', expertiseToRemove);
  };

  const addCollaborator = () => {
    if (newCollaborator.name.trim() && newCollaborator.type) {
      setCollaborators(prev => [...prev, { ...newCollaborator }]);
      setNewCollaborator({ name: '', type: 'postdoc' });
      console.log('HomeContentForm: Added collaborator:', newCollaborator);
    }
  };

  const removeCollaborator = (index: number) => {
    const removedCollaborator = collaborators[index];
    setCollaborators(prev => prev.filter((_, i) => i !== index));
    console.log('HomeContentForm: Removed collaborator:', removedCollaborator);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      console.log('HomeContentForm: Uploading profile image...');
      const response = await uploadProfileImage(file);
      setFormData(prev => ({
        ...prev,
        profileImageUrl: response.imageUrl
      }));
      console.log('HomeContentForm: Profile image uploaded successfully:', response.imageUrl);
      toast({
        title: 'Success',
        description: 'Profile image uploaded successfully.'
      });
    } catch (error) {
      console.error('HomeContentForm: Error uploading image:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.tagline?.trim() || !formData.bio?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name, tagline, and bio are required fields.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      console.log('HomeContentForm: Saving home content...');
      await updateHomeContent({
        ...formData,
        collaborators
      });
      console.log('HomeContentForm: Home content saved successfully');
      toast({
        title: 'Success',
        description: 'Home content updated successfully.'
      });
      onSuccess?.();
    } catch (error) {
      console.error('HomeContentForm: Error saving home content:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save home content.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Home Page Content</CardTitle>
        <CardDescription>
          Update your home page information, profile image, social links, and collaborators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {formData.profileImageUrl ? (
                  <img
                    src={`http://localhost:3000${formData.profileImageUrl}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('profile-image')?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={formData.yearsExperience || 0}
                onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Professional Tagline *</Label>
            <Input
              id="tagline"
              value={formData.tagline || ''}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              placeholder="Your professional tagline or title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headerText">Site Header Text</Label>
            <Input
              id="headerText"
              value={formData.headerText || ''}
              onChange={(e) => handleInputChange('headerText', e.target.value)}
              placeholder="Stellar Codex"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell your professional story..."
              rows={4}
              required
            />
          </div>

          {/* Core Expertise - Only allow selection from existing skills */}
          <div className="space-y-2">
            <Label>Core Expertise</Label>
            <p className="text-sm text-gray-600">Select from your existing skills to highlight as core expertise:</p>
            
            {/* Skills Selection */}
            {skills.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter(skill => !formData.coreExpertise?.includes(skill.name))
                    .map((skill) => (
                    <Button
                      key={skill._id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillAsExpertise(skill.name)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {skill.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No skills available. Please add skills on the Skills page first.</p>
            )}

            {formData.coreExpertise && formData.coreExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.coreExpertise.map((expertise, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {expertise}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeExpertise(expertise)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Collaborators Management */}
          <div className="space-y-4">
            <Label>Collaborators</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                value={newCollaborator.name}
                onChange={(e) => setNewCollaborator(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Collaborator name"
              />
              <Select
                value={newCollaborator.type}
                onValueChange={(value) => setNewCollaborator(prev => ({ ...prev, type: value as Collaborator['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {collaboratorTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addCollaborator} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {collaborators.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Current Collaborators ({collaborators.length})</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{collaborator.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {collaboratorTypes.find(t => t.value === collaborator.type)?.label}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label>Social Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={formData.socialLinks?.github || ''}
                  onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.socialLinks?.website || ''}
                  onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}