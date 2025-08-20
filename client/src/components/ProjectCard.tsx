import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, FileText } from 'lucide-react';
import { Project } from '@/api/projects';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isDragging = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('Navigating to project details:', project._id);
    navigate(`/projects/${project._id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    console.log('Opening external link:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-hold':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {project.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`ml-2 ${getStatusColor(project.status)}`}
          >
            {formatStatus(project.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          {project.liveUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, project.liveUrl!)}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Live
            </Button>
          )}
          
          {project.githubUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, project.githubUrl!)}
              className="flex items-center gap-1"
            >
              <Github className="h-3 w-3" />
              Code
            </Button>
          )}
          
          {project.paperUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, project.paperUrl!)}
              className="flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              Paper
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;