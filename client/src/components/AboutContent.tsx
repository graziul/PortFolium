import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Award, ExternalLink, Mail, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUserProfile, UserProfile } from '@/api/profile';
import { getHomeContent, HomeContent } from '@/api/homeContent';
import { ProfileForm } from '@/components/ProfileForm';
import { useToast } from '@/hooks/useToast';

export function AboutContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('About: Fetching user profile and home content...');
        
        const [profileResponse, homeContentResponse] = await Promise.all([
          getUserProfile().catch(error => {
            console.log('About: Profile not found, using defaults');
            return {
              user: {
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
              }
            };
          }),
          getHomeContent().catch(error => {
            console.log('About: Home content not found, using defaults');
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

        setProfile(profileResponse.user);
        setHomeContent(homeContentResponse.homeContent);
        console.log('About: Data loaded successfully');
      } catch (error) {
        console.error('About: Error loading data:', error);
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
    // Refresh profile data
    try {
      const profileResponse = await getUserProfile();
      setProfile(profileResponse.user);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('About: Error refreshing profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use bio from home content as primary source, fall back to profile bio
  const displayBio = homeContent?.bio || profile?.bio || 'No bio available. Please update your profile.';

  return (
    <div className="space-y-8">
      {/* Header with Edit Button */}
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
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <ProfileForm onSuccess={handleEditSuccess} onCancel={() => setShowEditDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Section - Using Home Content Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Personal accomplishments, hobbies, and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {displayBio.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Experience Section */}
          {profile?.experiences && profile.experiences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Professional Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.experiences.map((experience, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-6 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-semibold text-lg">{experience.position}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {experience.startDate} - {experience.endDate || 'Present'}
                            </div>
                          </div>
                          <p className="font-medium text-primary">{experience.company}</p>
                          {experience.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {experience.location}
                            </div>
                          )}
                          {experience.description && (
                            <p className="text-muted-foreground mt-2">{experience.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Education Section */}
          {profile?.education && profile.education.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.education.map((education, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-6 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-semibold text-lg">{education.degree}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {education.startDate} - {education.endDate || 'Present'}
                            </div>
                          </div>
                          <p className="font-medium text-primary">{education.institution}</p>
                          {education.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {education.location}
                            </div>
                          )}
                          {education.description && (
                            <p className="text-muted-foreground mt-2">{education.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Accomplishments Section */}
          {profile?.accomplishments && profile.accomplishments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Accomplishments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.accomplishments.map((accomplishment, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="font-semibold">{accomplishment.title}</h3>
                          {accomplishment.date && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {accomplishment.date}
                            </div>
                          )}
                        </div>
                        {accomplishment.organization && (
                          <p className="text-primary font-medium mb-2">{accomplishment.organization}</p>
                        )}
                        {accomplishment.description && (
                          <p className="text-muted-foreground">{accomplishment.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information - NO PHONE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${profile.email}`} className="text-sm hover:text-primary transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications */}
          {profile?.certifications && profile.certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.certifications.map((certification, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm">{certification.name}</h4>
                        {certification.issuer && (
                          <p className="text-xs text-muted-foreground mt-1">{certification.issuer}</p>
                        )}
                        {certification.date && (
                          <p className="text-xs text-muted-foreground mt-1">{certification.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Languages */}
          {profile?.languages && profile.languages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.languages.map((language, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{language.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {language.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}