import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Award, ExternalLink, Mail, Settings, Phone, Globe, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { getUserProfile, UserProfile, updateUserProfile } from '@/api/profile';
import { getHomeContent, HomeContent, updateHomeContent } from '@/api/homeContent';
import { CareerTimeline } from '@/components/CareerTimeline';
import { useToast } from '@/hooks/useToast';

interface ProfileFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  profile: UserProfile | null;
  homeContent: HomeContent | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess, onCancel, profile, homeContent }) => {
  const [formData, setFormData] = useState({
    bio: homeContent?.bio || profile?.bio || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (homeContent) {
        await updateHomeContent({
          ...homeContent,
          bio: formData.bio
        });
      } else {
        await updateUserProfile({
          bio: formData.bio
        });
      }

      toast({
        title: "Success",
        description: "About page content updated successfully.",
      });

      onSuccess();
    } catch (error) {
      console.error('ProfileForm: Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="bio">What I'm About Content</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell your story here... Use line breaks to separate paragraphs."
          rows={8}
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Use line breaks (Enter key) to separate paragraphs. Each line break will create a new paragraph.
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export function AboutContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('AboutContent: Fetching user profile and home content...');

        const [profileResponse, homeContentResponse] = await Promise.all([
          getUserProfile().catch(error => {
            console.log('AboutContent: Profile not found, using defaults');
            return {
              name: 'Your Name',
              email: '',
              bio: '',
              location: '',
              socialLinks: {
                linkedin: '',
                github: '',
                twitter: '',
                website: ''
              },
              experiences: [],
              education: [],
              certifications: [],
              languages: [],
              accomplishments: []
            };
          }),
          getHomeContent().catch(error => {
            console.log('AboutContent: Home content not found, using defaults');
            return {
              homeContent: {
                name: 'Your Name',
                tagline: 'Your professional tagline here',
                bio: 'Tell your professional story here...',
                headerText: 'Stellar Codex',
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
          })
        ]);

        setProfile(profileResponse);
        setHomeContent(homeContentResponse.homeContent);
        console.log('AboutContent: Data loaded successfully');
      } catch (error) {
        console.error('AboutContent: Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleEditSuccess = async () => {
    setShowEditDialog(false);

    try {
      const [profileResponse, homeContentResponse] = await Promise.all([
        getUserProfile(),
        getHomeContent()
      ]);
      setProfile(profileResponse);
      setHomeContent(homeContentResponse.homeContent);
      toast({
        title: "Success",
        description: "Content refreshed successfully.",
      });
    } catch (error) {
      console.error('AboutContent: Error refreshing data:', error);
    }
  };

  const formatBioText = (text: string) => {
    if (!text) return 'No bio available. Please update your profile.';

    console.log('AboutContent: Formatting bio text:', text);

    const paragraphs = text.split('\n').filter(paragraph => paragraph.trim() !== '');

    console.log('AboutContent: Split into paragraphs:', paragraphs);

    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 leading-relaxed text-gray-700 dark:text-gray-300">
        {paragraph.trim()}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayBio = homeContent?.bio || profile?.bio || 'No bio available. Please update your profile.';
  console.log('AboutContent: Display bio:', displayBio);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Get to know more about my background and experience
          </p>
        </div>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit About Page Content</DialogTitle>
            </DialogHeader>
            <ProfileForm
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditDialog(false)}
              profile={profile}
              homeContent={homeContent}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">What I'm About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="text-lg leading-relaxed">
                  {formatBioText(displayBio)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3">Contact Details</h3>
                  {profile?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-3">Connect With Me</h3>
                  <div className="space-y-3">
                    {profile?.socialLinks?.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {profile?.socialLinks?.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                    {profile?.socialLinks?.twitter && (
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Twitter
                      </a>
                    )}
                    {profile?.socialLinks?.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CareerTimeline />
        </motion.div>
      </div>
    </div>
  );
}