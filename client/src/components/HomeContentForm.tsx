import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload } from 'lucide-react';
import { getHomeContent, updateHomeContent, uploadProfileImage } from '@/api/homeContent';
import { getSkills, Skill } from '@/api/skills';
import { useToast } from '@/hooks/useToast';

interface HomeContentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function HomeContentForm({ onSuccess, onCancel }: HomeContentFormProps) {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    bio: '',
    yearsExperience: 0,
    coreExpertise: [] as string[],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      bluesky: ''
    }
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('HomeContentForm: Loading home content and skills...');
        setDataLoading(true);

        const [homeContentResponse, skillsResponse] = await Promise.all([
          getHomeContent(),
          getSkills()
        ]);

        const homeContent = homeContentResponse.homeContent;
        setFormData({
          name: homeContent.name || '',
          tagline: homeContent.tagline || '',
          bio: homeContent.bio || '',
          yearsExperience: homeContent.yearsExperience || 0,
          coreExpertise: homeContent.coreExpertise || [],
          socialLinks: {
            linkedin: homeContent.socialLinks?.linkedin || '',
            github: homeContent.socialLinks?.github || '',
            twitter: homeContent.socialLinks?.twitter || '',
            bluesky: homeContent.socialLinks?.bluesky || homeContent.socialLinks?.website || ''
          }
        });

        if (homeContent.profileImageUrl) {
          setProfileImagePreview('http://localhost:3000' + homeContent.profileImageUrl);
        }

        setSkills(skillsResponse.skills);
        console.log('HomeContentForm: Data loaded successfully');
      } catch (error) {
        console.error('HomeContentForm: Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form data',
          variant: 'destructive'
        });
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('socialLinks.')) {
      const socialField = field.replace('socialLinks.', '');
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

  const handleExpertiseToggle = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      coreExpertise: prev.coreExpertise.includes(skillName)
        ? prev.coreExpertise.filter(e => e !== skillName)
        : [...prev.coreExpertise, skillName]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileImageUrl = '';

      if (profileImage) {
        const uploadResponse = await uploadProfileImage(profileImage);
        profileImageUrl = uploadResponse.profileImageUrl;
      }

      const updateData = {
        ...formData,
        ...(profileImageUrl && { profileImageUrl })
      };

      await updateHomeContent(updateData);

      toast({
        title: 'Success',
        description: 'Home content updated successfully'
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('HomeContentForm: Error updating home content:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update home content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Home Page Content</CardTitle>
        <CardDescription>
          Update your personal information and profile settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image"
                />
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Professional Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              placeholder="Your professional tagline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell your professional story..."
              rows={4}
            />
          </div>

          {/* Core Expertise */}
          <div className="space-y-4">
            <Label>Core Expertise (Select up to 4)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  onClick={() => handleExpertiseToggle(skill.name)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.coreExpertise.includes(skill.name)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium">{skill.name}</div>
                  <div className="text-xs opacity-70">{skill.category}</div>
                </div>
              ))}
            </div>
            {formData.coreExpertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.coreExpertise.map((expertise, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {expertise}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleExpertiseToggle(expertise)}
                    />
                  </Badge>
                ))}
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
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bluesky">Bluesky</Label>
                <Input
                  id="bluesky"
                  value={formData.socialLinks.bluesky}
                  onChange={(e) => handleInputChange('socialLinks.bluesky', e.target.value)}
                  placeholder="https://bsky.app/profile/..."
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