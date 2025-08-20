import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon, PhoneIcon, MailIcon, CalendarIcon, BriefcaseIcon } from 'lucide-react';
import { getUserProfile, updateUserProfile, type UserProfile } from '@/api/profile';
import { useToast } from '@/hooks/useToast';

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

interface ExtendedUserProfile extends UserProfile {
  experiences?: Experience[];
  education?: Education[];
  certifications?: string[];
  languages?: string[];
}

export const About: React.FC = () => {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  });

  const [experienceForm, setExperienceForm] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  });

  const [educationForm, setEducationForm] = useState<Omit<Education, 'id'>>({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserProfile();
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || '',
        socialLinks: userData.socialLinks || {
          linkedin: '',
          github: '',
          twitter: '',
          website: ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await updateUserProfile(formData);
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAddExperience = () => {
    if (!profile) return;
    
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...experienceForm,
      achievements: experienceForm.achievements.filter(a => a.trim() !== '')
    };

    const updatedExperiences = [...(profile.experiences || []), newExperience];
    setProfile({ ...profile, experiences: updatedExperiences });
    setExperienceForm({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
    setShowExperienceDialog(false);
    toast({
      title: "Success",
      description: "Experience added successfully",
    });
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setExperienceForm(experience);
    setShowExperienceDialog(true);
  };

  const handleUpdateExperience = () => {
    if (!profile || !editingExperience) return;

    const updatedExperiences = profile.experiences?.map(exp => 
      exp.id === editingExperience.id 
        ? { ...experienceForm, id: editingExperience.id }
        : exp
    ) || [];

    setProfile({ ...profile, experiences: updatedExperiences });
    setEditingExperience(null);
    setExperienceForm({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
    setShowExperienceDialog(false);
    toast({
      title: "Success",
      description: "Experience updated successfully",
    });
  };

  const handleDeleteExperience = (experienceId: string) => {
    if (!profile) return;
    
    const updatedExperiences = profile.experiences?.filter(exp => exp.id !== experienceId) || [];
    setProfile({ ...profile, experiences: updatedExperiences });
    toast({
      title: "Success",
      description: "Experience deleted successfully",
    });
  };

  const handleAddEducation = () => {
    if (!profile) return;
    
    const newEducation: Education = {
      id: Date.now().toString(),
      ...educationForm
    };

    const updatedEducation = [...(profile.education || []), newEducation];
    setProfile({ ...profile, education: updatedEducation });
    setEducationForm({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    });
    setShowEducationDialog(false);
    toast({
      title: "Success",
      description: "Education added successfully",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const calculateDuration = (startDate: string, endDate?: string, current?: boolean) => {
    const start = new Date(startDate);
    const end = current ? new Date() : (endDate ? new Date(endDate) : new Date());
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              About Me
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Professional background and experience
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Basic Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.socialLinks.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.socialLinks.website}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, website: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{profile?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{profile?.bio}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  {profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      {profile.phone}
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-1">
                      <MailIcon className="w-4 h-4" />
                      {profile.email}
                    </div>
                  )}
                </div>
                {profile?.socialLinks && (
                  <div className="flex flex-wrap gap-2">
                    {profile.socialLinks.linkedin && (
                      <Badge variant="secondary">
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Badge>
                    )}
                    {profile.socialLinks.github && (
                      <Badge variant="secondary">
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </Badge>
                    )}
                    {profile.socialLinks.twitter && (
                      <Badge variant="secondary">
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Badge>
                    )}
                    {profile.socialLinks.website && (
                      <Badge variant="secondary">
                        <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Experience Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                Professional Experience
              </CardTitle>
              <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                    </DialogTitle>
                    <DialogDescription>
                      Add details about your professional experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exp-title">Job Title</Label>
                        <Input
                          id="exp-title"
                          value={experienceForm.title}
                          onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-company">Company</Label>
                        <Input
                          id="exp-company"
                          value={experienceForm.company}
                          onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="exp-location">Location</Label>
                      <Input
                        id="exp-location"
                        value={experienceForm.location}
                        onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exp-start">Start Date</Label>
                        <Input
                          id="exp-start"
                          type="date"
                          value={experienceForm.startDate}
                          onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-end">End Date</Label>
                        <Input
                          id="exp-end"
                          type="date"
                          value={experienceForm.endDate}
                          onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                          disabled={experienceForm.current}
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <input
                            type="checkbox"
                            id="current-role"
                            checked={experienceForm.current}
                            onChange={(e) => setExperienceForm({ 
                              ...experienceForm, 
                              current: e.target.checked,
                              endDate: e.target.checked ? '' : experienceForm.endDate
                            })}
                          />
                          <Label htmlFor="current-role" className="text-sm">Current role</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="exp-description">Description</Label>
                      <Textarea
                        id="exp-description"
                        value={experienceForm.description}
                        onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={editingExperience ? handleUpdateExperience : handleAddExperience}
                    >
                      {editingExperience ? 'Update' : 'Add'} Experience
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {profile?.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-6">
                {profile.experiences
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((experience) => (
                    <div key={experience.id} className="border-l-2 border-blue-200 pl-4 relative">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-1"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold">{experience.title}</h4>
                          <p className="text-blue-600 font-medium">{experience.company}</p>
                          {experience.location && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPinIcon className="w-3 h-3" />
                              {experience.location}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExperience(experience)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExperience(experience.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate || '')}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{calculateDuration(experience.startDate, experience.endDate, experience.current)}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {experience.description}
                      </p>
                      {experience.achievements && experience.achievements.length > 0 && (
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {experience.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No professional experience added yet.</p>
                <p className="text-sm">Click "Add Experience" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Education</CardTitle>
              <Dialog open={showEducationDialog} onOpenChange={setShowEducationDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>
                      Add details about your educational background
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edu-degree">Degree</Label>
                      <Input
                        id="edu-degree"
                        value={educationForm.degree}
                        onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edu-institution">Institution</Label>
                      <Input
                        id="edu-institution"
                        value={educationForm.institution}
                        onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edu-location">Location</Label>
                      <Input
                        id="edu-location"
                        value={educationForm.location}
                        onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edu-start">Start Date</Label>
                        <Input
                          id="edu-start"
                          type="date"
                          value={educationForm.startDate}
                          onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edu-end">End Date</Label>
                        <Input
                          id="edu-end"
                          type="date"
                          value={educationForm.endDate}
                          onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edu-gpa">GPA (Optional)</Label>
                        <Input
                          id="edu-gpa"
                          value={educationForm.gpa}
                          onChange={(e) => setEducationForm({ ...educationForm, gpa: e.target.value })}
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edu-description">Description (Optional)</Label>
                      <Textarea
                        id="edu-description"
                        value={educationForm.description}
                        onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                        rows={2}
                        placeholder="Relevant coursework, honors, activities..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddEducation}>Add Education</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {profile?.education && profile.education.length > 0 ? (
              <div className="space-y-4">
                {profile.education
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((education) => (
                    <div key={education.id} className="border-l-2 border-green-200 pl-4 relative">
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-2 top-1"></div>
                      <div>
                        <h4 className="text-lg font-semibold">{education.degree}</h4>
                        <p className="text-green-600 font-medium">{education.institution}</p>
                        {education.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            {education.location}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {formatDate(education.startDate)} - {formatDate(education.endDate || '')}
                          </span>
                          {education.gpa && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span>GPA: {education.gpa}</span>
                            </>
                          )}
                        </div>
                        {education.description && (
                          <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                            {education.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No education information added yet.</p>
                <p className="text-sm">Click "Add Education" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};