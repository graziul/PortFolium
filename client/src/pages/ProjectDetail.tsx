import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeft,
  Calendar,
  Users,
  ExternalLink,
  Github,
  FileText,
  Newspaper,
  Clock,
  Tag,
  Building2
} from 'lucide-react';
import { getProject, Project } from '../api/projects';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        console.error('ProjectDetail: Project ID is missing');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Project ID is missing"
        });
        navigate('/projects');
        return;
      }

      try {
        console.log('ProjectDetail: Fetching project details for ID:', id);
        setLoading(true);
        const response = await getProject(id) as { project: Project };
        console.log('ProjectDetail: Project details fetched successfully:', response.project);
        console.log('ProjectDetail: Checking for user-requested features:', {
          hasMediaCoverage: !!(response.project.mediaCoverage && response.project.mediaCoverage.length > 0),
          hasPaperUrl: !!response.project.paperUrl,
          hasEnthusiasmLevel: !!(response.project as any).enthusiasmLevel,
          mediaCoverageCount: response.project.mediaCoverage?.length || 0
        });
        setProject(response.project);
      } catch (error) {
        console.error('ProjectDetail: Error fetching project details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch project details"
        });
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, toast]);

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
      console.error('ProjectDetail: Error formatting date:', error);
      return dateString;
    }
  };

  const handleBackClick = () => {
    console.log('ProjectDetail: Navigating back to project tracker');
    navigate('/project-tracker');
  };

  const handleExternalLink = (url: string, type: string) => {
    console.log(`ProjectDetail: Opening ${type} link:`, url);
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
            Back to Project Tracker
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Project Tracker
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <Button onClick={() => navigate(`/projects/edit/${project._id}`)}>
          Edit Project
        </Button>
      </div>

      {/* Project Banner/Thumbnail */}
      {(project.bannerUrl || project.thumbnailUrl) && (
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={project.bannerUrl || project.thumbnailUrl}
                  alt={project.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                </Badge>
              </div>

              {project.shortDescription && (
                <div>
                  <span className="text-sm font-medium">Short Description:</span>
                  <p className="text-gray-600 mt-1">{project.shortDescription}</p>
                </div>
              )}

              {/* Enthusiasm Level - User mentioned this was implemented well */}
              {(project as any).enthusiasmLevel && (
                <div>
                  <span className="text-sm font-medium">Enthusiasm Level:</span>
                  <Badge variant="outline" className="ml-2">
                    {(project as any).enthusiasmLevel}
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">{formatDate(project.startDate)}</p>
                    </div>
                  </div>
                )}

                {project.endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-gray-600">{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(project.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
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
          )}

          {/* Project Links */}
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.liveUrl && (
                  <Button
                    variant="outline"
                    onClick={() => handleExternalLink(project.liveUrl!, 'live demo')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                )}

                {project.githubUrl && (
                  <Button
                    variant="outline"
                    onClick={() => handleExternalLink(project.githubUrl!, 'GitHub repository')}
                    className="w-full"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                )}

                {/* Paper button - User specifically requested this */}
                {project.paperUrl && (
                  <Button
                    variant="outline"
                    onClick={() => handleExternalLink(project.paperUrl!, 'research paper')}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Paper
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media Coverage Section - User specifically requested this */}
          {project.mediaCoverage && project.mediaCoverage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  Media Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.mediaCoverage.map((coverage, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{coverage.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{coverage.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {coverage.source}
                            </span>
                            {coverage.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(coverage.date)}
                              </span>
                            )}
                          </div>
                        </div>
                        {coverage.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExternalLink(coverage.url!, 'media coverage')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                        )}
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
          {/* Project Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium">Featured Project:</span>
                <p className="text-sm text-gray-600">{project.featured ? 'Yes' : 'No'}</p>
              </div>

              <Separator />

              <div>
                <span className="text-sm font-medium">Last Updated:</span>
                <p className="text-sm text-gray-600">{formatDate(project.updatedAt)}</p>
              </div>

              {project.collaboratorCount !== undefined && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium">Collaborators:</span>
                    <p className="text-sm text-gray-600">{project.collaboratorCount}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Collaboration Status */}
          {project.openToCollaborators && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Open to Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  This project is open to collaborators. Feel free to reach out if you're interested in contributing!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Sponsor Status */}
          {project.acceptingSponsors && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Accepting Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  This project is accepting sponsors. Contact us if you'd like to support this work!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Collaborators List */}
          {project.collaborators && project.collaborators.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm">{collaborator}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}