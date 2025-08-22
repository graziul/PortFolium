import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, Code, Palette, Database, Globe, Smartphone, Brain, Zap, Target, Clock, Users, Briefcase, Plus, Edit, Trash2, BarChart3, FileText, MessageSquare, Lightbulb, Settings, Languages, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getSkills, deleteSkill, Skill } from '@/api/skills';
import { SkillForm } from '@/components/SkillForm';
import { useToast } from '@/hooks/useToast';
import { useLocation } from 'react-router-dom';
import api from '@/api/api';

const categoryIcons = {
  'Technical': Code,
  'Research Methods': Brain,
  'Statistical Analysis': BarChart3,
  'Data Science & Analytics': Database,
  'Communication & Writing': FileText,
  'Project Management': Target,
  'Leadership & Collaboration': Users,
  'Domain Expertise': Lightbulb,
  'Software & Tools': Settings,
  'Languages': Languages,
  // Legacy categories for backward compatibility
  'Frontend Frameworks': Code,
  'Backend Technologies': Database,
  'Programming Languages': Globe,
  'Design Tools': Palette,
  'Mobile': Smartphone,
  'Databases': Database,
  'AI/Data Science': Brain,
  'DevOps': Zap,
  'Strategic Leadership': Users,
};

const categoryColors = {
  'Technical': '#3B82F6',
  'Research Methods': '#8B5CF6',
  'Statistical Analysis': '#10B981',
  'Data Science & Analytics': '#EC4899',
  'Communication & Writing': '#F59E0B',
  'Project Management': '#EF4444',
  'Leadership & Collaboration': '#F97316',
  'Domain Expertise': '#06B6D4',
  'Software & Tools': '#84CC16',
  'Languages': '#6366F1',
  // Legacy categories
  'Frontend Frameworks': '#3B82F6',
  'Backend Technologies': '#10B981',
  'Programming Languages': '#8B5CF6',
  'Design Tools': '#F59E0B',
  'Mobile': '#EF4444',
  'Databases': '#06B6D4',
  'AI/Data Science': '#EC4899',
  'DevOps': '#84CC16',
  'Strategic Leadership': '#F97316',
};

const experienceLevelColors = {
  'expert': 'bg-emerald-500',
  'advanced': 'bg-blue-500',
  'intermediate': 'bg-yellow-500',
  'beginner': 'bg-gray-500',
};

const experienceLevelLabels = {
  'expert': 'Expert',
  'advanced': 'Advanced',
  'intermediate': 'Intermediate',
  'beginner': 'Learning',
};

const technicalCategories = ['Technical', 'Software & Tools', 'Data Science & Analytics'];
const nonTechnicalCategories = ['Research Methods', 'Statistical Analysis', 'Communication & Writing', 'Project Management', 'Leadership & Collaboration', 'Domain Expertise', 'Languages'];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  const fetchSkills = async () => {
    try {
      console.log('Skills: Fetching skills...');
      const response = await getSkills();
      setSkills(response.skills);
      console.log('Skills: Skills loaded successfully, count:', response.skills.length);

      // Handle highlighting skill from navigation state
      if (location.state?.highlightSkill) {
        setTimeout(() => {
          const skillElement = document.querySelector(`[data-skill-name="${location.state.highlightSkill}"]`);
          if (skillElement) {
            skillElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            skillElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/20');
            setTimeout(() => {
              skillElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/20');
            }, 3000);
          }
        }, 500);
      }
    } catch (error: any) {
      console.error('Skills: Error loading skills:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const migrateCategories = async () => {
    setMigrating(true);
    try {
      console.log('Skills: Migrating skill categories...');
      const response = await api.post('/api/skills/migrate-categories');
      console.log('Skills: Migration response:', response.data);
      toast({
        title: "Success",
        description: `Updated ${response.data.updated} of ${response.data.total} skills to new categories`,
      });
      // Refresh skills after migration
      await fetchSkills();
    } catch (error: any) {
      console.error('Skills: Error migrating categories:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to migrate skill categories",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDeleteSkill = async (skillId: string, skillName: string) => {
    try {
      await deleteSkill(skillId);
      toast({
        title: "Success",
        description: `${skillName} has been deleted successfully`,
      });
      fetchSkills(); // Refresh the skills list
    } catch (error: any) {
      console.error('Skills: Error deleting skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  // Categorize skills - include ALL skills, not just those matching specific categories
  const allSkillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const technicalSkills = skills.filter(skill => technicalCategories.includes(skill.category));
  const nonTechnicalSkills = skills.filter(skill => nonTechnicalCategories.includes(skill.category));
  const otherSkills = skills.filter(skill =>
    !technicalCategories.includes(skill.category) &&
    !nonTechnicalCategories.includes(skill.category)
  );

  const technicalSkillsByCategory = technicalSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const nonTechnicalSkillsByCategory = nonTechnicalSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const expertSkills = skills.filter(s => s.experienceLevel === 'expert');
  const recentlyUsedSkills = skills.filter(s => s.lastUsed && new Date(s.lastUsed) > new Date('2024-01-01'));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h1>
          <div className="flex gap-2">
            <Button onClick={migrateCategories} disabled={migrating} variant="outline">
              {migrating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Migrating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Migrate Categories
                </>
              )}
            </Button>
            <SkillForm onSuccess={fetchSkills} />
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive overview of my interdisciplinary skills, showcasing depth of experience across research methods, technical capabilities, and collaborative expertise.
        </p>
      </motion.div>

      {/* Skills Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <TrendingUp className="h-6 w-6 mx-auto text-blue-600" />
            <CardTitle className="text-lg text-blue-700 dark:text-blue-300">{skills.length}</CardTitle>
            <CardDescription className="text-xs">Total Skills</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <Award className="h-6 w-6 mx-auto text-green-600" />
            <CardTitle className="text-lg text-green-700 dark:text-green-300">{expertSkills.length}</CardTitle>
            <CardDescription className="text-xs">Expert Level</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <Target className="h-6 w-6 mx-auto text-purple-600" />
            <CardTitle className="text-lg text-purple-700 dark:text-purple-300">
              {Object.keys(allSkillsByCategory).length}
            </CardTitle>
            <CardDescription className="text-xs">Skill Categories</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <Clock className="h-6 w-6 mx-auto text-orange-600" />
            <CardTitle className="text-lg text-orange-700 dark:text-orange-300">{recentlyUsedSkills.length}</CardTitle>
            <CardDescription className="text-xs">Recently Active</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* All Skills List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Skills</h2>
          <Badge variant="outline">
            {skills.length} skills total
          </Badge>
        </div>

        {Object.keys(allSkillsByCategory).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(allSkillsByCategory).map(([category, categorySkills]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;

              return (
                <Card key={category} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-white/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category}</CardTitle>
                        <CardDescription>
                          {categorySkills.length} skills
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill._id}
                          data-skill-name={skill.name}
                          className="group p-3 rounded-lg bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${experienceLevelColors[skill.experienceLevel]}`} />
                              <h3 className="font-medium text-sm">{skill.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {experienceLevelLabels[skill.experienceLevel]}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {skill.yearsOfExperience}y
                              </Badge>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <SkillForm
                                  skill={skill}
                                  onSuccess={fetchSkills}
                                  trigger={
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  }
                                />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{skill.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSkill(skill._id, skill.name)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>

                          {skill.description && (
                            <p className="text-xs text-muted-foreground mb-2">{skill.description}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {skill.projects?.length || 0} project{(skill.projects?.length || 0) !== 1 ? 's' : ''}
                            </span>
                            {skill.lastUsed && (
                              <span className="text-xs text-muted-foreground">
                                Last used: {new Date(skill.lastUsed).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {skill.relatedSkills.slice(0, 3).map((relatedSkill) => (
                                <Badge key={relatedSkill} variant="outline" className="text-xs px-1 py-0">
                                  {relatedSkill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Skills Yet</h3>
            <p className="text-muted-foreground mb-4">Start building your skills portfolio</p>
            <SkillForm onSuccess={fetchSkills} />
          </div>
        )}
      </motion.div>
    </div>
  );
}