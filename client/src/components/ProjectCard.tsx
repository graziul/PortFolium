import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, FileText, Globe, Code2, BookOpen, Rocket, Terminal, GraduationCap, Users, DollarSign } from 'lucide-react';
import { Project } from '@/api/projects';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
}

// Energy level emoji mapping (renamed from enthusiasm)
const energyEmojis = {
  'Low': '😴',
  'Medium': '😊',
  'High': '🤩',
  'Very High': '🚀'
};

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
      case 'ideation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'researching':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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

  // Fix image URL to use backend server
  const getImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-200 hover:border-gray-300 ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Thumbnail Image Section */}
      {(project.thumbnailUrl || project.imageUrl) && (
        <div className="aspect-video overflow-hidden relative">
          <img
            src={getImageUrl(project.thumbnailUrl || project.imageUrl)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={{
              height: '160px',
              objectFit: 'cover'
            }}
            onLoad={() => {
              console.log('ProjectCard: Image loaded successfully:', getImageUrl(project.thumbnailUrl || project.imageUrl));
            }}
            onError={(e) => {
              console.error('ProjectCard: Image failed to load:', getImageUrl(project.thumbnailUrl || project.imageUrl));
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold line-clamp-2 flex-1 pr-2">
            {project.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={`ml-2 text-xs ${getStatusColor(project.status)}`}
          >
            {formatStatus(project.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-3 pb-3">
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        {/* Energy Level with Emoji (renamed from enthusiasm) */}
        {project.enthusiasmLevel && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Energy: {energyEmojis[project.enthusiasmLevel]}
            </span>
          </div>
        )}

        {/* Collaboration and Sponsor Indicators */}
        <div className="flex gap-1 flex-wrap">
          {project.openToCollaborators && (
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Open to Collaborators
            </Badge>
          )}
          {project.acceptingSponsors && (
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Accepting Sponsors
            </Badge>
          )}
        </div>

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

        <div className="flex gap-1 pt-1">
          {project.liveUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, project.liveUrl!)}
              className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300 transition-colors h-7 px-2 text-xs"
              title="View Live Demo"
            >
              <Rocket className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600 font-medium">Demo</span>
            </Button>
          )}

          {project.githubUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, project.githubUrl!)}
              className="flex items-center gap-1 hover:bg-gray-50 hover:border-gray-400 transition-colors h-7 px-2 text-xs"
              title="View Source Code"
            >
              <Terminal className="h-3 w-3 text-gray-700" />
              <span className="text-gray-700 font-medium">Code</span>
            </Button>
          )}

          {project.paperUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleButtonClick(e, project.paperUrl!)}
              className="flex items-center gap-1 hover:bg-purple-50 hover:border-purple-300 transition-colors h-7 px-2 text-xs"
              title="Read Research Paper"
            >
              <GraduationCap className="h-3 w-3 text-purple-600" />
              <span className="text-purple-600 font-medium">Paper</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;