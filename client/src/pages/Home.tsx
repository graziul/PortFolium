import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Briefcase, BookOpen, Users, Star, TrendingUp, Activity, GraduationCap, Building, UserCheck, Briefcase as BriefcaseIcon, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getProjects, Project } from '@/api/projects';
import { getBlogPosts, BlogPost } from '@/api/blog';
import { getSkills, Skill } from '@/api/skills';
import { getCollaborators, Collaborator } from '@/api/collaborators';
import { useToast } from '@/hooks/useToast';
import { Link } from 'react-router-dom';

export function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCollabCard, setHoveredCollabCard] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching home page data...');
        const [projectsResponse, blogResponse, skillsResponse, collaboratorsResponse] = await Promise.all([
          getProjects(),
          getBlogPosts(),
          getSkills(),
          getCollaborators()
        ]);

        setProjects((projectsResponse as any).projects.slice(0, 3));
        setBlogPosts((blogResponse as any).posts.slice(0, 2));
        setSkills((skillsResponse as any).skills);
        setCollaborators((collaboratorsResponse as any).collaborators);
        console.log('Home page data loaded successfully');
      } catch (error) {
        console.error('Error loading home page data:', error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const topSkills = skills.filter(s => s.experienceLevel === 'expert' || s.experienceLevel === 'advanced').slice(0, 4);
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'development').length;

  const collaboratorsByType = collaborators.reduce((acc, collab) => {
    // Group by main categories with subcategories
    if (['postdoc', 'junior_faculty', 'senior_faculty'].includes(collab.type)) {
      if (!acc['academia']) acc['academia'] = { total: 0, subcategories: {} };
      acc['academia'].total += 1;
      acc['academia'].subcategories[collab.type] = (acc['academia'].subcategories[collab.type] || 0) + 1;
    } else if (['industry_tech', 'industry_finance', 'industry_healthcare'].includes(collab.type)) {
      if (!acc['industry']) acc['industry'] = { total: 0, subcategories: {} };
      acc['industry'].total += 1;
      acc['industry'].subcategories[collab.type] = (acc['industry'].subcategories[collab.type] || 0) + 1;
    } else if (['undergraduate', 'graduate'].includes(collab.type)) {
      if (!acc['students']) acc['students'] = { total: 0, subcategories: {} };
      acc['students'].total += 1;
      acc['students'].subcategories[collab.type] = (acc['students'].subcategories[collab.type] || 0) + 1;
    } else if (['professional_ethicist', 'journalist'].includes(collab.type)) {
      if (!acc['others']) acc['others'] = { total: 0, subcategories: {} };
      acc['others'].total += 1;
      acc['others'].subcategories[collab.type] = (acc['others'].subcategories[collab.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, { total: number; subcategories: Record<string, number> }>);

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

  return (
    <div className="space-y-16">
      {/* Hero Section - Two Column Layout */}
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
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                John Doe
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Full-Stack Developer & UI/UX Designer crafting digital experiences that make a difference
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

            {/* Quick Stats */}
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
                <div className="text-2xl font-bold text-green-600">4+</div>
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
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                alt="Profile"
                className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-xl"
              />
            </div>

            {/* Top Skills Preview */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/40">
              <h3 className="text-lg font-semibold mb-4">Core Expertise</h3>
              <div className="grid grid-cols-2 gap-3">
                {topSkills.map((skill) => (
                  <div key={skill._id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      skill.experienceLevel === 'expert' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>
      </motion.section>

      {/* Interactive Dashboard Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <Code className="h-8 w-8 mx-auto text-green-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-green-700 dark:text-green-300">{completedProjects}</CardTitle>
            <CardDescription>Completed Projects</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <Activity className="h-8 w-8 mx-auto text-blue-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-blue-700 dark:text-blue-300">{inProgressProjects}</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-purple-700 dark:text-purple-300">{collaborators.length}</CardTitle>
            <CardDescription>Collaborators</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="text-center">
            <BookOpen className="h-8 w-8 mx-auto text-orange-600 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-orange-700 dark:text-orange-300">{blogPosts.length * 10}+</CardTitle>
            <CardDescription>Blog Articles</CardDescription>
          </CardHeader>
        </Card>
      </motion.section>

      {/* Collaboration Highlight */}
      <motion.section
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
                {collaboratorsByType.academia?.total || 0}
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
                {hoveredCollabCard === 'academia' && collaboratorsByType.academia && (
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {Object.entries(collaboratorsByType.academia.subcategories).map(([type, count]) => (
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
              <BriefcaseIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-2xl text-green-700 dark:text-green-300">
                {collaboratorsByType.industry?.total || 0}
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
                {hoveredCollabCard === 'industry' && collaboratorsByType.industry && (
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {Object.entries(collaboratorsByType.industry.subcategories).map(([type, count]) => (
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
                {collaboratorsByType.students?.total || 0}
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
                {hoveredCollabCard === 'students' && collaboratorsByType.students && (
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {Object.entries(collaboratorsByType.students.subcategories).map(([type, count]) => (
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
                {collaboratorsByType.others?.total || 0}
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
                {hoveredCollabCard === 'others' && collaboratorsByType.others && (
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {Object.entries(collaboratorsByType.others.subcategories).map(([type, count]) => (
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

      {/* Featured Projects */}
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
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge
                      variant={project.status === 'completed' ? 'default' : project.status === 'development' ? 'secondary' : 'outline'}
                      className="bg-white/90 dark:bg-gray-900/90"
                    >
                      {project.status}
                    </Badge>
                    {project.openToCollaborators && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <Users className="h-3 w-3 mr-1" />
                        Open
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    {project.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
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
              <Link to={`/blog/${post._id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.readTime} min read</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
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
    </div>
  );
}