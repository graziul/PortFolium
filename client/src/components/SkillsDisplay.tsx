import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp } from 'lucide-react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsExperience: number;
  isFeatured: boolean;
  projects?: string[];
  certifications?: string[];
  description?: string;
}

interface SkillsDisplayProps {
  skills: Skill[];
  showCategories?: boolean;
  showProgress?: boolean;
  maxSkills?: number;
  highlightSkill?: string;
  onSkillClick?: (skill: Skill) => void;
}

const categoryColors = {
  'Technical': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Research': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Communication': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Leadership': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Analytical': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'Creative': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'Methodological': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  'Domain': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
};

export function SkillsDisplay({ 
  skills, 
  showCategories = true, 
  showProgress = true, 
  maxSkills,
  highlightSkill,
  onSkillClick 
}: SkillsDisplayProps) {
  console.log('SkillsDisplay: Rendering with skills:', skills.length);

  if (!skills || skills.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No skills to display</p>
      </div>
    );
  }

  const displaySkills = maxSkills ? skills.slice(0, maxSkills) : skills;
  const groupedSkills = showCategories 
    ? displaySkills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>)
    : { 'All Skills': displaySkills };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 70) return 'Advanced';
    if (proficiency >= 50) return 'Intermediate';
    if (proficiency >= 30) return 'Beginner';
    return 'Learning';
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return 'text-green-600';
    if (proficiency >= 70) return 'text-blue-600';
    if (proficiency >= 50) return 'text-yellow-600';
    if (proficiency >= 30) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          {showCategories && (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{category}</h3>
              <Badge variant="outline" className="text-xs">
                {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySkills.map((skill) => (
              <Card 
                key={skill._id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  highlightSkill === skill.name ? 'ring-2 ring-primary shadow-lg' : ''
                } ${onSkillClick ? 'cursor-pointer hover:scale-105' : ''}`}
                onClick={() => onSkillClick?.(skill)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      {skill.name}
                      {skill.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </CardTitle>
                    {showCategories && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${categoryColors[skill.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {skill.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {skill.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>
                  )}

                  {showProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Proficiency</span>
                        <span className={`text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                          {getProficiencyLabel(skill.proficiency)} ({skill.proficiency}%)
                        </span>
                      </div>
                      <Progress value={skill.proficiency} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{skill.yearsExperience} year{skill.yearsExperience !== 1 ? 's' : ''}</span>
                    </div>
                    
                    {skill.projects && skill.projects.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span>{skill.projects.length} project{skill.projects.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {skill.certifications && skill.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skill.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {skill.certifications.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{skill.certifications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}