```
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Users, BookOpen, Activity, Settings, UserPlus, GraduationCap, Building, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getProjects, Project } from '@/api/projects';
import { getBlogPosts, BlogPost } from '@/api/blog';
import { getFeaturedSkills, Skill } from '@/api/skills';
import { getHomeContent, HomeContent } from '@/api/homeContent';
import { getCollaboratorStats } from '@/api/collaborators';
import { HomeContentForm } from '@/components/HomeContentForm';
import { useToast } from '@/hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';

export function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [collaboratorStats, setCollaboratorStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCollabCard, setHoveredCollabCard] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultProfileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face";

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Home: Fetching home page data...');

        const [projectsResponse, blogResponse, featuredSkillsResponse] = await Promise.all([
          getProjects(),
          getBlogPosts(),
          getFeaturedSkills()
        ]);

        setProjects((projectsResponse as any).projects);
        setBlogPosts((blogResponse as any).posts.slice(0, 2));
        setFeaturedSkills((featuredSkillsResponse as any).skills);

        let hasCollaboratorStats = false;

        try {
          const homeContentResponse = await getHomeContent();
          setHomeContent(homeContentResponse.homeContent);

          // Use collaborator stats from home content (this is where the data exists)
          if (homeContentResponse.homeContent.collaboratorStats) {
            console.log('Home: Using collaborator stats from home content:', homeContentResponse.homeContent.collaboratorStats);
            setCollaboratorStats(homeContentResponse.homeContent.collaboratorStats);
            hasCollaboratorStats = true;
          }
        } catch (homeError) {
          console.log('Home: Home content not found, using defaults');
          setHomeContent({
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
          });
        }

        // Only try API if we don't have stats from home content
        if (!hasCollaboratorStats) {
          try {
            const statsResponse = await getCollaboratorStats();
            console.log('Home: Collaborator stats from API:', statsResponse.stats);

            const transformedStats = {
              academia: { total: 0, subcategories: { postdoc: 0, junior_faculty: 0, senior_faculty: 0 } },
              industry: { total: 0, subcategories: { industry_tech: 0, industry_finance: 0, industry_healthcare: 0 } },
              students: { total: 0, subcategories: { undergraduate: 0, graduate: 0 } },
              others: { total: 0, subcategories: { professional_ethicist: 0, journalist: 0 } }
            };

            statsResponse.stats.forEach((stat: any) => {
              const type = stat._id;
              const count = stat.count;

              if (['postdoc', 'junior_faculty', 'senior_faculty'].includes(type)) {
                transformedStats.academia.total += count;
                transformedStats.academia.subcategories[type] = count;
              } else if (['industry_tech', 'industry_finance', 'industry_healthcare'].includes(type)) {
                transformedStats.industry.total += count;
                transformedStats.industry.subcategories[type] = count;
              } else if (['undergraduate', 'graduate'].includes(type)) {
                transformedStats.students.total += count;
                transformedStats.students.subcategories[type] = count;
              } else if (['professional_ethicist', 'journalist'].includes(type)) {
                transformedStats.others.total += count;
                transformedStats.others.subcategories[type] = count;
              }
            });

            setCollaboratorStats(transformedStats);
          } catch (statsError) {
            console.log('Home: Collaborator stats not available, using defaults');
            setCollaboratorStats({
              academia: { total: 0, subcategories: { postdoc: 0, junior_faculty: 0, senior_faculty: 0 } },
              industry: { total: 0, subcategories: { industry_tech: 0, industry_finance: 0, industry_healthcare: 0 } },
              students: { total: 0, subcategories: { undergraduate: 0, graduate: 0 } },
              others: { total: 0, subcategories: { professional_ethicist: 0, journalist: 0 } }
            });
          }
        }

        console.log('Home: Data loaded successfully');
      } catch (error) {
        console.error('Home: Error loading home page data:', error);
        toast({
          title: "Error",
          description: "Failed to load some content. Please try again.",
          variant: "destructive",
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
      const homeContentResponse = await getHomeContent();
      setHomeContent(homeContentResponse.homeContent);
      toast({
        title: "Success",
        description: "Home content updated successfully.",
      });
    } catch (error) {
      console.error('Home: Error refreshing home content:', error);
    }
  };

  const scrollToCollaborators = () => {
    const collaboratorsSection = document.getElementById('collaborators-section');
    if (collaboratorsSection) {
      collaboratorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatSubcategoryName = (type: string) => {
    const names = {
      'postdoc': 'Postdocs',
      'junior_faculty': 'Junior Faculty',
      'senior_faculty': 'Senior Faculty',
      'industry_tech': 'Tech',
      'industry_finance': 'Finance',
      'industry_healthcare': 'Healthcare',
      'undergraduate': 'Undergraduate',
      'graduate': 'Graduate',
      'professional_ethicist': 'Ethicists',
      'journalist': 'Journalists'
    };
    return names[type as keyof typeof names] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
  const totalCollaborators = collaboratorStats ?
    Object.values(collaboratorStats).reduce((sum: number, category: any) => sum + category.total, 0) : 0;

  const displayedExpertise = homeContent?.coreExpertise && homeContent.coreExpertise.length > 0
    ? homeContent.coreExpertise
    : featuredSkills.slice(0, 4).map(skill => skill.name);

  return (
    <div className="space-y-16">
      {/* Hero Section - Restored with full styling */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-12"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Home Page Content</DialogTitle>
                    </DialogHeader>
                    <HomeContentForm onSuccess={handleEditSuccess} onCancel={() => setShowEditDialog(false)} />
                  </DialogContent>
                </Dialog>
                <Button asChild variant="ghost" size="sm" className="opacity-70 hover:opacity-100" title="Manage Collaborators">
                  <Link to="/collaborators">
                    <UserPlus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <h2 className="text-3xl font-bold mb-2">{homeContent?.name || 'Your Name'}</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {homeContent?.tagline || 'Your professional tagline here'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link to="/projects">
                    View Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Get In Touch</Link>
                </Button>
              </div>
            </motion.div>

            {/* Quick Stats - Restored styling */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="text-2xl font-bold text-blue-600">{projects.length}+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                <div className="text-2xl font-bold text-green-600">{homeContent?.yearsExperience || 0}+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile & Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-center">
              <img
                src={homeContent?.profileImageUrl ? 'http://localhost:3000' + homeContent.profileImageUrl : defaultProfileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-xl"
              />
            </div>

            {/* Core Expertise - Restored styling */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/40">
              <h3 className="text-lg font-semibold mb-4">Core Expertise</h3>
              <div className="grid grid-cols-2 gap-3">
                {displayedExpertise.slice(0, 4).map((expertise, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/40 dark:hover:bg-gray-800/40 p-2 rounded-lg transition-colors"
                    onClick={() => navigate('/skills', { state: { highlightSkill: expertise } })}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium hover:text-primary transition-colors">{expertise}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background decoration - Restored */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
      </motion.section>

      {/* Dashboard Cards - Restored with gradients and proper click handlers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card
          className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 cursor-pointer"
          onClick={() => navigate('/projects?status=completed')}
        >
          <CardHeader className="text-center">
            <Code className="h-8 w-8 mx-auto text-green-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-green-700 dark:text-green-300">{completedProjects}</CardTitle>
            <CardDescription>Completed Projects</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 cursor-pointer"
          onClick={() => navigate('/project-tracker')}
        >
          <CardHeader className="text-center">
            <Activity className="h-8 w-8 mx-auto text-blue-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-blue-700 dark:text-blue-300">{inProgressProjects}</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 cursor-pointer"
          onClick={scrollToCollaborators}
        >
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-purple-700 dark:text-purple-300">{totalCollaborators}</CardTitle>
            <CardDescription>Collaborators</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800 cursor-pointer"
          onClick={() => navigate('/blog')}
        >
          <CardHeader className="text-center">
            <BookOpen className="h-8 w-8 mx-auto text-orange-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-orange-700 dark:text-orange-300">{blogPosts.length}</CardTitle>
            <CardDescription>Blog Articles</CardDescription>
          </CardHeader>
        </Card>
      </motion.section>

      {/* Collaborators Section - Restored with full styling and hover effects */}
      {collaboratorStats && (
        <motion.section
          id="collaborators-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Interdisciplinary Collaboration</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Bridging disciplines through collaborative partnerships with academic institutions, industry researchers, and innovative teams
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card
              className="text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredCollabCard('academia')}
              onMouseLeave={() => setHoveredCollabCard(null)}
            >
              <CardHeader className="pb-2">
                <GraduationCap className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">
                  {collaboratorStats.academia?.total || 0}
                </CardTitle>
                <CardDescription className="text-xs">Academia</CardDescription>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredCollabCard === 'academia' ? 1 : 0,
                    height: hoveredCollabCard === 'academia' ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {hoveredCollabCard === 'academia' && collaboratorStats.academia && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      {Object.entries(collaboratorStats.academia.subcategories).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span>{formatSubcategoryName(type)}:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </CardHeader>
            </Card>

            <Card
              className="text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredCollabCard('industry')}
              onMouseLeave={() => setHoveredCollabCard(null)}
            >
              <CardHeader className="pb-2">
                <Building className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <CardTitle className="text-2xl text-green-700 dark:text-green-300">
                  {collaboratorStats.industry?.total || 0}
                </CardTitle>
                <CardDescription className="text-xs">Industry</CardDescription>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredCollabCard === 'industry' ? 1 : 0,
                    height: hoveredCollabCard === 'industry' ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {hoveredCollabCard === 'industry' && collaboratorStats.industry && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      {Object.entries(collaboratorStats.industry.subcategories).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span>{formatSubcategoryName(type)}:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </CardHeader>
            </Card>

            <Card
              className="text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredCollabCard('students')}
              onMouseLeave={() => setHoveredCollabCard(null)}
            >
              <CardHeader className="pb-2">
                <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <CardTitle className="text-2xl text-purple-700 dark:text-purple-300">
                  {collaboratorStats.students?.total || 0}
                </CardTitle>
                <CardDescription className="text-xs">Students</CardDescription>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredCollabCard === 'students' ? 1 : 0,
                    height: hoveredCollabCard === 'students' ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {hoveredCollabCard === 'students' && collaboratorStats.students && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      {Object.entries(collaboratorStats.students.subcategories).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span>{formatSubcategoryName(type)}:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </CardHeader>
            </Card>

            <Card
              className="text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredCollabCard('others')}
              onMouseLeave={() => setHoveredCollabCard(null)}
            >
              <CardHeader className="pb-2">
                <Newspaper className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <CardTitle className="text-2xl text-orange-700 dark:text-orange-300">
                  {collaboratorStats.others?.total || 0}
                </CardTitle>
                <CardDescription className="text-xs">Others</CardDescription>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredCollabCard === 'others' ? 1 : 0,
                    height: hoveredCollabCard === 'others' ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {hoveredCollabCard === 'others' && collaboratorStats.others && (
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      {Object.entries(collaboratorStats.others.subcategories).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span>{formatSubcategoryName(type)}:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </CardHeader>
            </Card>
          </div>
        </motion.section>
      )}

      {/* Featured Projects - Restored styling */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/project-tracker">
                Live Tracker <Activity className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/projects">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
            >
              <Link to={'/projects/' + project._id}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.thumbnailUrl ? 'http://localhost:3000' + project.thumbnailUrl : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge
                        variant={project.status === 'completed' ? 'default' : project.status === 'in-progress' ? 'secondary' : 'outline'}
                        className="bg-white/90 dark:bg-gray-900/90"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg hover:text-primary transition-colors">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Blog Posts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <Button asChild variant="outline">
            <Link to="/blog">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={'/blog/' + post.slug}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
```