import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MailIcon, BriefcaseIcon, GraduationCapIcon, LinkIcon } from 'lucide-react';
import { getUserProfile, updateUserProfile, addExperience, deleteExperience, addEducation, deleteEducation, type UserProfile } from '@/api/profile';
import { CareerTimeline } from '@/components/CareerTimeline';
import { useToast } from '@/hooks/useToast';

interface Experience {
  _id: string;
  title: string;
  company: string;
  startDate: string;
  description: string;
  current?: boolean;
  endDate?: string;
  location?: string;
  achievements?: string[];
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  startDate: string;
  description?: string;
  endDate?: string;
  location?: string;
  gpa?: string;
}

interface ExtendedUserProfile extends UserProfile {
  experiences?: Experience[];
  education?: Education[];
}

export const About: React.FC = () => {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    startDate: '',
    description: '',
    current: false,
    endDate: '',
    location: '',
    achievements: [] as string[]
  });

  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    gpa: ''
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
        socialLinks: {
          linkedin: userData.socialLinks?.linkedin || '',
          github: userData.socialLinks?.github || '',
          twitter: userData.socialLinks?.twitter || '',
          website: userData.socialLinks?.website || ''
        }
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data",
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAddExperience = async () => {
    try {
      const newExperience = await addExperience(experienceForm);
      if (profile) {
        const updatedExperiences = [...(profile.experiences || []), newExperience];
        setProfile({ ...profile, experiences: updatedExperiences });
      }
      setExperienceForm({
        title: '',
        company: '',
        startDate: '',
        description: '',
        current: false,
        endDate: '',
        location: '',
        achievements: []
      });
      setShowExperienceDialog(false);
      toast({ title: "Success", description: "Experience added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add experience",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      await deleteExperience(experienceId);
      if (profile) {
        const updatedExperiences = profile.experiences?.filter(exp => exp._id !== experienceId) || [];
        setProfile({ ...profile, experiences: updatedExperiences });
      }
      toast({ title: "Success", description: "Experience deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  const handleAddEducation = async () => {
    try {
      const newEducation = await addEducation(educationForm);
      if (profile) {
        const updatedEducation = [...(profile.education || []), newEducation];
        setProfile({ ...profile, education: updatedEducation });
      }
      setEducationForm({
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        description: '',
        location: '',
        gpa: ''
      });
      setShowEducationDialog(false);
      toast({ title: "Success", description: "Education added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add education",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    try {
      await deleteEducation(educationId);
      if (profile) {
        const updatedEducation = profile.education?.filter(edu => edu._id !== educationId) || [];
        setProfile({ ...profile, education: updatedEducation });
      }
      toast({ title: "Success", description: "Education deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">About Me</h1>
            <p className="text-lg text-gray-600">Professional background and experience</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
            <PencilIcon className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

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
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Social Links
                  </Label>
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
                        placeholder="https://linkedin.com/in/username"
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
                        placeholder="https://github.com/username"
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
                        placeholder="https://twitter.com/username"
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
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
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
                  <p className="text-gray-600 leading-relaxed">{profile?.bio}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile?.location && <span>📍 {profile.location}</span>}
                  {profile?.phone && <span>📞 {profile.phone}</span>}
                  {profile?.email && <span>✉️ {profile.email}</span>}
                </div>
                
                {profile?.socialLinks && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Social Links
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {profile.socialLinks.linkedin && (
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
                          GitHub
                        </a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          Twitter
                        </a>
                      )}
                      {profile.socialLinks.website && (
                        <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <CareerTimeline className="mb-8" />

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                Professional Experience
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowExperienceDialog(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {profile?.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-4">
                {profile.experiences.map((experience) => (
                  <div key={experience._id} className="border p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold">{experience.title}</h4>
                        <p className="text-blue-600 font-medium">{experience.company}</p>
                        {experience.location && <p className="text-gray-500 text-sm">{experience.location}</p>}
                        <p className="text-gray-500 text-sm">
                          {new Date(experience.startDate).toLocaleDateString()} - {
                            experience.current ? 'Present' :
                            experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Present'
                          }
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExperience(experience._id)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700">{experience.description}</p>
                    {experience.achievements && experience.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-sm">Key Achievements:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {experience.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No professional experience added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon className="w-5 h-5" />
                Education
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowEducationDialog(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {profile?.education && profile.education.length > 0 ? (
              <div className="space-y-4">
                {profile.education.map((education) => (
                  <div key={education._id} className="border p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold">{education.degree}</h4>
                        <p className="text-green-600 font-medium">{education.institution}</p>
                        {education.location && <p className="text-gray-500 text-sm">{education.location}</p>}
                        <p className="text-gray-500 text-sm">
                          {new Date(education.startDate).toLocaleDateString()} - {
                            education.endDate ? new Date(education.endDate).toLocaleDateString() : 'Present'
                          }
                        </p>
                        {education.gpa && <p className="text-gray-500 text-sm">GPA: {education.gpa}</p>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEducation(education._id)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    {education.description && <p className="text-gray-700">{education.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No education added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
              <div>
                <Label htmlFor="exp-location">Location</Label>
                <Input
                  id="exp-location"
                  value={experienceForm.location}
                  onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="exp-start">Start Date</Label>
                <Input
                  id="exp-start"
                  type="date"
                  value={experienceForm.startDate}
                  onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exp-current"
                  checked={experienceForm.current}
                  onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                />
                <Label htmlFor="exp-current">Current Position</Label>
              </div>
              {!experienceForm.current && (
                <div>
                  <Label htmlFor="exp-end">End Date</Label>
                  <Input
                    id="exp-end"
                    type="date"
                    value={experienceForm.endDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="exp-description">Description</Label>
                <Textarea
                  id="exp-description"
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExperience}>Add Experience</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEducationDialog} onOpenChange={setShowEducationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edu-degree">Degree</Label>
                <Input
                  id="edu-degree"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
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
                <Label htmlFor="edu-gpa">GPA</Label>
                <Input
                  id="edu-gpa"
                  value={educationForm.gpa}
                  onChange={(e) => setEducationForm({ ...educationForm, gpa: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edu-description">Description</Label>
                <Textarea
                  id="edu-description"
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEducation}>Add Education</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};