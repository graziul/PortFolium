import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, Code, Palette, Database, Globe, Smartphone, Brain, Zap, Target, Clock, Users, Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getSkills, deleteSkill, Skill } from '@/api/skills';
import { SkillForm } from '@/components/SkillForm';
import { useToast } from '@/hooks/useToast';

const categoryIcons = {
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

const technicalCategories = ['Frontend Frameworks', 'Backend Technologies', 'Programming Languages', 'Design Tools', 'Mobile', 'Databases', 'AI/Data Science', 'DevOps'];
const nonTechnicalCategories = ['Strategic Leadership'];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSkills = async () => {
    try {
      console.log('Fetching skills...');
      const response = await getSkills();
      setSkills(response.skills);
      console.log('Skills loaded successfully');
    } catch (error: any) {
      console.error('Error loading skills:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const technicalSkills = skills.filter(skill => technicalCategories.includes(skill.category));
  const nonTechnicalSkills = skills.filter(skill => nonTechnicalCategories.includes(skill.category));

  const getSkillsByCategory = (skillSet: Skill[]) => {
    return skillSet.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  };

  const technicalSkillsByCategory = getSkillsByCategory(technicalSkills);
  const nonTechnicalSkillsByCategory = getSkillsByCategory(nonTechnicalSkills);

  const expertSkills = skills.filter(s => s.experienceLevel === 'expert');
  const recentlyUsedSkills = skills.filter(s => s.lastUsed && new Date(s.lastUsed) > new Date('2024-01-01'));

  // Calculate pie chart data for technical skills
  const technicalPieChartData = Object.entries(technicalSkillsByCategory).map(([category, categorySkills]) => ({
    category,
    count: categorySkills.length,
    color: categoryColors[category as keyof typeof categoryColors] || '#6B7280',
    percentage: (categorySkills.length / technicalSkills.length) * 100
  }));

  // Calculate pie chart data for non-technical skills
  const nonTechnicalPieChartData = Object.entries(nonTechnicalSkillsByCategory).map(([category, categorySkills]) => ({
    category,
    count: categorySkills.length,
    color: categoryColors[category as keyof typeof categoryColors] || '#6B7280',
    percentage: (categorySkills.length / nonTechnicalSkills.length) * 100
  }));

  // SVG Pie Chart Component
  const PieChart = ({ data }: { data: typeof technicalPieChartData }) => {
    const size = 300;
    const center = size / 2;
    const radius = 100;

    let cumulativePercentage = 0;

    const createArcPath = (startAngle: number, endAngle: number) => {
      const start = polarToCartesian(center, center, radius, endAngle);
      const end = polarToCartesian(center, center, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
        "M", center, center,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };

    return (
      <div className="flex items-center">
        <svg width={size} height={size} className="mr-8">
          {data.map((item, index) => {
            const startAngle = cumulativePercentage * 3.6;
            const endAngle = (cumulativePercentage + item.percentage) * 3.6;
            cumulativePercentage += item.percentage;

            return (
              <motion.path
                key={index}
                d={createArcPath(startAngle, endAngle)}
                fill={item.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                onMouseEnter={() => setHoveredSkill(item.category)}
                onMouseLeave={() => setHoveredSkill(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="grid grid-cols-1 gap-3 flex-1">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                hoveredSkill === item.category ? 'bg-white/60 dark:bg-gray-800/60 scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredSkill(item.category)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                <div className="font-medium">{item.category}</div>
                <div className="text-muted-foreground text-xs">
                  {item.count} skills ({item.percentage.toFixed(1)}%)
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const SkillsGrid = ({ skillsByCategory, cardColors }: { skillsByCategory: Record<string, Skill[]>, cardColors: Record<string, string> }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;
        const isNonTechnical = nonTechnicalCategories.includes(category);

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + categoryIndex * 0.1, duration: 0.6 }}
          >
            <Card className={`${isNonTechnical ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800' : 'bg-white/60 dark:bg-gray-900/60'} backdrop-blur-sm border-white/30 h-full`}>
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
                {categorySkills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + categoryIndex * 0.1 + skillIndex * 0.05, duration: 0.4 }}
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
                        {skill.projects.length} project{skill.projects.length !== 1 ? 's' : ''}
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
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

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
          <SkillForm onSuccess={fetchSkills} />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive overview of my technical skills, showcasing depth of experience and breadth of knowledge across disciplines.
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
            <CardDescription className="text-xs">Technical Skills</CardDescription>
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
              {Object.keys(technicalSkillsByCategory).length + Object.keys(nonTechnicalSkillsByCategory).length}
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

      {/* Skills Distribution with Tabs */}
      {(technicalPieChartData.length > 0 || nonTechnicalPieChartData.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Skills Distribution</h2>

          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="technical">Technical Skills</TabsTrigger>
              <TabsTrigger value="non-technical">Non-Technical Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="technical">
              {technicalPieChartData.length > 0 ? (
                <PieChart data={technicalPieChartData} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No technical skills added yet. Click "Add Skill" to get started!
                </div>
              )}
            </TabsContent>

            <TabsContent value="non-technical">
              {nonTechnicalPieChartData.length > 0 ? (
                <PieChart data={nonTechnicalPieChartData} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No non-technical skills added yet. Click "Add Skill" to get started!
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.section>
      )}

      {/* Skills by Category - Enhanced Layout with Tabs */}
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="technical">Technical Skills</TabsTrigger>
          <TabsTrigger value="non-technical">Non-Technical Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          {Object.keys(technicalSkillsByCategory).length > 0 ? (
            <SkillsGrid skillsByCategory={technicalSkillsByCategory} cardColors={categoryColors} />
          ) : (
            <div className="text-center py-12">
              <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Technical Skills Yet</h3>
              <p className="text-muted-foreground mb-4">Start building your technical skills portfolio</p>
              <SkillForm onSuccess={fetchSkills} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="non-technical">
          {Object.keys(nonTechnicalSkillsByCategory).length > 0 ? (
            <SkillsGrid skillsByCategory={nonTechnicalSkillsByCategory} cardColors={categoryColors} />
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Non-Technical Skills Yet</h3>
              <p className="text-muted-foreground mb-4">Add your leadership and soft skills</p>
              <SkillForm onSuccess={fetchSkills} />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Experience Timeline */}
      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Skill Development Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['expert', 'advanced', 'intermediate', 'beginner'].map((level, index) => {
              const levelSkills = skills.filter(s => s.experienceLevel === level);
              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
                >
                  <Card className="text-center bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg ${experienceLevelColors[level as keyof typeof experienceLevelColors]}`}>
                        {levelSkills.length}
                      </div>
                      <CardTitle className="text-lg">{experienceLevelLabels[level as keyof typeof experienceLevelLabels]}</CardTitle>
                      <CardDescription className="text-xs">Skills at this level</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {levelSkills.slice(0, 3).map((skill) => (
                          <Badge key={skill._id} variant="outline" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {levelSkills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{levelSkills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}