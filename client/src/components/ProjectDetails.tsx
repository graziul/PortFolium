import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  ExternalLink, 
  Github, 
  FileText,
  Newspaper,
  Clock,
  Tag
} from 'lucide-react';
import { getProject, Project } from '@/api/projects';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        console.error('Project ID is missing');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Project ID is missing"
        });
        navigate('/dashboard');
        return;
      }

      try {
        console.log('Fetching project details for ID:', id);
        setLoading(true);
        const response = await getProject(id);
        console.log('Project details fetched successfully:', response.project);
        setProject(response.project);
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch project details"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleBackClick = () => {
    console.log('Navigating back to dashboard');
    navigate('/dashboard');
  };

  const handleExternalLink = (url: string, type: string) => {
    console.log(`Opening ${type} link:`, url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.githubUrl && (
              <Button 
                variant="outline" 
                onClick={() => handleExternalLink(project.githubUrl!, 'GitHub')}
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </Button>
            )}
            {project.liveUrl && (
              <Button 
                variant="outline"
                onClick={() => handleExternalLink(project.liveUrl!, 'Live Demo')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Live
              </Button>
            )}
            {project.paperUrl && (
              <Button 
                variant="outline"
                onClick={() => handleExternalLink(project.paperUrl!, 'Paper')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Paper
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Image */}
          {project.imageUrl && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Error loading project image:', project.imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Coverage */}
          {project.mediaCoverage && project.mediaCoverage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Media Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.mediaCoverage.map((coverage) => (
                    <div key={coverage._id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="font-semibold text-gray-900">{coverage.title}</h4>
                        <Badge variant="outline">{coverage.publication}</Badge>
                      </div>
                      {coverage.description && (
                        <p className="text-gray-600 text-sm mt-1">{coverage.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(coverage.publishedDate)}
                        </span>
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => handleExternalLink(coverage.url, 'Media Coverage')}
                          className="p-0 h-auto"
                        >
                          Read Article <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Started:</span>
                <span className="ml-2 font-medium">{formatDate(project.startDate)}</span>
              </div>
              
              {project.endDate && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Completed:</span>
                  <span className="ml-2 font-medium">{formatDate(project.endDate)}</span>
                </div>
              )}

              {project.category && (
                <div className="flex items-center text-sm">
                  <Tag className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{project.category}</span>
                </div>
              )}

              <Separator />

              <div className="text-xs text-gray-500">
                <p>Created: {formatDate(project.createdAt)}</p>
                <p>Updated: {formatDate(project.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Collaborators */}
          {project.collaborators && project.collaborators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">
                          {collaborator.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{collaborator}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.githubUrl && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExternalLink(project.githubUrl!, 'GitHub')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Source Code
                </Button>
              )}
              {project.liveUrl && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExternalLink(project.liveUrl!, 'Live Demo')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Demo
                </Button>
              )}
              {project.paperUrl && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExternalLink(project.paperUrl!, 'Paper')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Read Paper
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;