import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, MapPin, Globe, Linkedin, Github, Twitter, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/ContactForm';
import { getUserProfile } from '@/api/profile';
import { getHomeContent } from '@/api/homeContent';
import { useToast } from '@/hooks/useToast';

export function Contact() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [homeContent, setHomeContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  console.log('Contact: Component rendering...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Contact: Fetching user profile and home content...');
        
        const [profileResponse, homeContentResponse] = await Promise.all([
          getUserProfile(),
          getHomeContent()
        ]);
        
        console.log('Contact: Profile data received:', profileResponse);
        console.log('Contact: Home content data received:', homeContentResponse);
        
        setUserProfile(profileResponse);
        setHomeContent(homeContentResponse.homeContent);
        
        console.log('Contact: Data loaded successfully');
      } catch (error) {
        console.error('Contact: Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load contact information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    console.log('Contact: Showing loading spinner...');
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('Contact: Rendering main content with container styling...');
  console.log('Contact: Container classes applied: container mx-auto px-4 py-8 max-w-4xl');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Get In Touch</h1>
          <p className="text-muted-foreground">
            Let's connect and explore opportunities for collaboration.
          </p>
        </motion.div>

        {/* Contact Information - Two Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Contact Details */}
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`mailto:${userProfile?.email}`}
                      className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                    </a>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <a
                        href={`mailto:${userProfile?.email}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {userProfile?.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  {userProfile?.phone && (
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${userProfile.phone}`}
                        className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-green-600" />
                      </a>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Phone</p>
                        <a
                          href={`tel:${userProfile.phone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {userProfile.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {userProfile?.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{userProfile.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Social Media Links in 2x2 Grid */}
                {homeContent?.socialLinks && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Links</p>
                    <div className="grid grid-cols-2 gap-2">
                      {homeContent.socialLinks.linkedin && (
                        <a
                          href={homeContent.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Linkedin className="w-3 h-3" />
                          LinkedIn
                        </a>
                      )}

                      {homeContent.socialLinks.github && (
                        <a
                          href={homeContent.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          GitHub
                        </a>
                      )}

                      {homeContent.socialLinks.twitter && (
                        <a
                          href={homeContent.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-sky-100 dark:bg-sky-900/20 text-sky-600 hover:bg-sky-200 dark:hover:bg-sky-900/40 transition-colors"
                        >
                          <Twitter className="w-3 h-3" />
                          Twitter
                        </a>
                      )}

                      {homeContent.socialLinks.bluesky && (
                        <a
                          href={homeContent.socialLinks.bluesky}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                          <Globe className="w-3 h-3" />
                          Bluesky
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form - Directly Below Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}