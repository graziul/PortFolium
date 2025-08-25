import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/ContactForm';
import { getUserProfile } from '@/api/profile';
import { useToast } from '@/hooks/useToast';

export function Contact() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Contact: Fetching user profile...');
        const profileResponse = await getUserProfile();
        setUserProfile(profileResponse);
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's connect and explore opportunities for collaboration.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Reach out through email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${userProfile?.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {userProfile?.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Response Promise */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Quick Response</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                I typically respond to messages within 24-48 hours. For urgent matters,
                please mention it in your message subject line.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}