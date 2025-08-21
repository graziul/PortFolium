import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MailIcon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react';
import { getUserProfile, updateUserProfile, type UserProfile } from '@/api/profile';
import { CareerTimeline } from '@/components/CareerTimeline';
import { useToast } from '@/hooks/useToast';

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  description?: string;
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
    phone: ''
  });

  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    startDate: '',
    description: ''
  });

  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
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
        phone: userData.phone || ''
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
      ...experienceForm
    };
    const updatedExperiences = [...(profile.experiences || []), newExperience];
    setProfile({ ...profile, experiences: updatedExperiences });
    setExperienceForm({ title: '', company: '', startDate: '', description: '' });
    setShowExperienceDialog(false);
    toast({ title: "Success", description: "Experience added successfully" });
  };

  const handleDeleteExperience = (experienceId: string) => {
    if (!profile) return;
    const updatedExperiences = profile.experiences?.filter(exp => exp.id !== experienceId) || [];
    setProfile({ ...profile, experiences: updatedExperiences });
    toast({ title: "Success", description: "Experience deleted successfully" });
  };

  const handleAddEducation = () => {
    if (!profile) return;
    const newEducation: Education = {
      id: Date.now().toString(),
      ...educationForm
    };
    const updatedEducation = [...(profile.education || []), newEducation];
    setProfile({ ...profile, education: updatedEducation });
    setEducationForm({ degree: '', institution: '', startDate: '', endDate: '', description: '' });
    setShowEducationDialog(false);
    toast({ title: "Success", description: "Education added successfully" });
  };

  const handleDeleteEducation = (educationId: string) => {
    if (!profile) return;
    const updatedEducation = profile.education?.filter(edu => edu.id !== educationId) || [];
    setProfile({ ...profile, education: updatedEducation });
    toast({ title: "Success", description: "Education deleted successfully" });
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
                  <div key={experience.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold">{experience.title}</h4>
                        <p className="text-blue-600 font-medium">{experience.company}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExperience(experience.id)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700">{experience.description}</p>
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
                  <div key={education.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-semibold">{education.degree}</h4>
                        <p className="text-green-600 font-medium">{education.institution}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEducation(education.id)}>
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700">{education.description}</p>
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
                <Input id="exp-title" value={experienceForm.title} onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="exp-company">Company</Label>
                <Input id="exp-company" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="exp-start">Start Date</Label>
                <Input id="exp-start" type="date" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="exp-description">Description</Label>
                <Textarea id="exp-description" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
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
                <Input id="edu-degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edu-institution">Institution</Label>
                <Input id="edu-institution" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edu-start">Start Date</Label>
                <Input id="edu-start" type="date" value={educationForm.startDate} onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edu-end">End Date</Label>
                <Input id="edu-end" type="date" value={educationForm.endDate} onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edu-description">Description</Label>
                <Textarea id="edu-description" value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
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