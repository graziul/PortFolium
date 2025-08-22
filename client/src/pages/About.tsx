import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, PencilIcon, TrashIcon, MailIcon, BriefcaseIcon, GraduationCapIcon, TrophyIcon, StarIcon, AwardIcon, CalendarIcon } from 'lucide-react';
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

interface Accomplishment {
  _id?: string;
  title: string;
  description: string;
  date: string;
  category: 'professional' | 'personal' | 'academic' | 'hobby';
}

interface ExtendedUserProfile extends UserProfile {
  experiences?: Experience[];
  education?: Education[];
  accomplishments?: Accomplishment[];
}

export const About: React.FC = () => {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const [showAccomplishmentDialog, setShowAccomplishmentDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: ''
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

  const [accomplishmentForm, setAccomplishmentForm] = useState({
    title: '',
    description: '',
    date: '',
    category: 'professional' as 'professional' | 'personal' | 'academic' | 'hobby'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      console.log('About: Fetching user profile...');
      const userData = await getUserProfile();
      console.log('About: Profile loaded successfully');
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || ''
      });
    } catch (error: any) {
      console.error('About: Error fetching profile:', error);
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
      console.log('About: Saving profile changes...');
      const updatedProfile = await updateUserProfile(formData);
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      setIsEditing(false);
      console.log('About: Profile updated successfully');
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('About: Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAddExperience = async () => {
    try {
      console.log('About: Adding new experience...');
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
      console.log('About: Experience added successfully');
      toast({ title: "Success", description: "Experience added successfully" });
    } catch (error: any) {
      console.error('About: Error adding experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add experience",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      console.log('About: Deleting experience:', experienceId);
      await deleteExperience(experienceId);
      if (profile) {
        const updatedExperiences = profile.experiences?.filter(exp => exp._id !== experienceId) || [];
        setProfile({ ...profile, experiences: updatedExperiences });
      }
      console.log('About: Experience deleted successfully');
      toast({ title: "Success", description: "Experience deleted successfully" });
    } catch (error: any) {
      console.error('About: Error deleting experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  const handleAddEducation = async () => {
    try {
      console.log('About: Adding new education...');
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
      console.log('About: Education added successfully');
      toast({ title: "Success", description: "Education added successfully" });
    } catch (error: any) {
      console.error('About: Error adding education:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add education",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    try {
      console.log('About: Deleting education:', educationId);
      await deleteEducation(educationId);
      if (profile) {
        const updatedEducation = profile.education?.filter(edu => edu._id !== educationId) || [];
        setProfile({ ...profile, education: updatedEducation });
      }
      console.log('About: Education deleted successfully');
      toast({ title: "Success", description: "Education deleted successfully" });
    } catch (error: any) {
      console.error('About: Error deleting education:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive",
      });
    }
  };

  const handleAddAccomplishment = async () => {
    try {
      console.log('About: Adding new accomplishment...');
      // For now, we'll add it to the local state since the backend might not have this endpoint yet
      const newAccomplishment: Accomplishment = {
        _id: Date.now().toString(), // Temporary ID
        ...accomplishmentForm
      };
      
      if (profile) {
        const updatedAccomplishments = [...(profile.accomplishments || []), newAccomplishment];
        setProfile({ ...profile, accomplishments: updatedAccomplishments });
      }
      
      setAccomplishmentForm({
        title: '',
        description: '',
        date: '',
        category: 'professional'
      });
      setShowAccomplishmentDialog(false);
      console.log('About: Accomplishment added successfully');
      toast({ title: "Success", description: "Accomplishment added successfully" });
    } catch (error: any) {
      console.error('About: Error adding accomplishment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add accomplishment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccomplishment = (accomplishmentId: string) => {
    try {
      console.log('About: Deleting accomplishment:', accomplishmentId);
      if (profile) {
        const updatedAccomplishments = profile.accomplishments?.filter(acc => acc._id !== accomplishmentId) || [];
        setProfile({ ...profile, accomplishments: updatedAccomplishments });
      }
      console.log('About: Accomplishment deleted successfully');
      toast({ title: "Success", description: "Accomplishment deleted successfully" });
    } catch (error: any) {
      console.error('About: Error deleting accomplishment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete accomplishment",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'professional':
        return <BriefcaseIcon className="w-4 h-4" />;
      case 'academic':
        return <GraduationCapIcon className="w-4 h-4" />;
      case 'personal':
        return <StarIcon className="w-4 h-4" />;
      case 'hobby':
        return <AwardIcon className="w-4 h-4" />;
      default:
        return <TrophyIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'academic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'personal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hobby':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <p className="text-lg text-gray-600">Professional background, experience, and personal accomplishments</p>
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                Personal Accomplishments
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAccomplishmentDialog(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Accomplishment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {profile?.accomplishments && profile.accomplishments.length > 0 ? (
              <div className="space-y-4">
                {profile.accomplishments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((accomplishment) => (
                  <div key={accomplishment._id} className="border p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{accomplishment.title}</h4>
                          <Badge className={`text-xs flex items-center gap-1 ${getCategoryColor(accomplishment.category)}`}>
                            {getCategoryIcon(accomplishment.category)}
                            {accomplishment.category}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{accomplishment.description}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(accomplishment.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => accomplishment._id && handleDeleteAccomplishment(accomplishment._id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No accomplishments added yet.</p>
                <p className="text-sm">Share your achievements, awards, certifications, and personal milestones!</p>
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

        <Dialog open={showAccomplishmentDialog} onOpenChange={setShowAccomplishmentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Accomplishment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="acc-title">Title</Label>
                <Input
                  id="acc-title"
                  value={accomplishmentForm.title}
                  onChange={(e) => setAccomplishmentForm({ ...accomplishmentForm, title: e.target.value })}
                  placeholder="e.g., Published Research Paper, Won Hackathon, Completed Marathon"
                />
              </div>
              <div>
                <Label htmlFor="acc-description">Description</Label>
                <Textarea
                  id="acc-description"
                  value={accomplishmentForm.description}
                  onChange={(e) => setAccomplishmentForm({ ...accomplishmentForm, description: e.target.value })}
                  placeholder="Describe your accomplishment and its significance..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="acc-date">Date</Label>
                <Input
                  id="acc-date"
                  type="date"
                  value={accomplishmentForm.date}
                  onChange={(e) => setAccomplishmentForm({ ...accomplishmentForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="acc-category">Category</Label>
                <select
                  id="acc-category"
                  value={accomplishmentForm.category}
                  onChange={(e) => setAccomplishmentForm({ 
                    ...accomplishmentForm, 
                    category: e.target.value as 'professional' | 'personal' | 'academic' | 'hobby'
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="professional">Professional</option>
                  <option value="academic">Academic</option>
                  <option value="personal">Personal</option>
                  <option value="hobby">Hobby</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAccomplishment}>Add Accomplishment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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