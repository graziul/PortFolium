import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Calendar, ExternalLink, Github, FileText, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { getProject, Project } from '@/api/projects';
import { getCollaborators, Collaborator } from '@/api/collaborators';
import { CollaboratorForm } from './CollaboratorForm';
import { useToast } from '@/hooks/useToast';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCollaboratorForm, setShowCollaboratorForm] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | undefined>();

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      fetchCollaborators();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      console.log('ProjectDetails: Fetching project details for ID:', id);
      const response = await getProject(id!);
      console.log('ProjectDetails: Project details fetched successfully');
      setProject(response.project);
    } catch (error) {
      console.error('ProjectDetails: Error fetching project details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch project details.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await getCollaborators();
      setCollaborators(response.collaborators);
    } catch (error) {
      console.error('ProjectDetails: Error fetching collaborators:', error);
    }
  };

  const handleCollaboratorSuccess = () => {
    setShowCollaboratorForm(false);
    setEditingCollaborator(undefined);
    fetchCollaborators();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideation':
        return 'bg-purple-100 text-purple-800';
      case 'researching':
        return 'bg-orange-100 text-orange-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  const handleExternalLink = (url: string, type: string) => {
    console.log(`Opening ${type} link:`, url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
        <Button
          onClick={() => navigate(`/projects/edit/${project._id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getStatusColor(project.status)}>
                      {formatStatus(project.status)}
                    </Badge>
                    {project.enthusiasmLevel && (
                      <Badge variant="outline">
                        Energy: {project.enthusiasmLevel === 'Low' ? '😴' :
                                project.enthusiasmLevel === 'Medium' ? '😊' :
                                project.enthusiasmLevel === 'High' ? '🤩' :
                                project.enthusiasmLevel === 'Very High' ? '🚀' : '😊'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {project.shortDescription && (
                <CardDescription className="text-lg">
                  {project.shortDescription}
                </CardDescription>
              )}
            </CardHeader>

            {(project.thumbnailUrl || project.imageUrl) && (
              <div className="px-6">
                <img
                  src={`http://localhost:3000${project.thumbnailUrl || project.imageUrl}`}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
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

          {/* Collaborators Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaborators ({collaborators.length})
                </CardTitle>
                <Dialog open={showCollaboratorForm} onOpenChange={setShowCollaboratorForm}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Collaborator
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCollaborator ? 'Edit Collaborator' : 'Add New Collaborator'}
                      </DialogTitle>
                    </DialogHeader>
                    <CollaboratorForm
                      collaborator={editingCollaborator}
                      onSuccess={handleCollaboratorSuccess}
                      onCancel={() => {
                        setShowCollaboratorForm(false);
                        setEditingCollaborator(undefined);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {collaborators.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{collaborator.name}</h4>
                          <p className="text-sm text-gray-600">{collaborator.email}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingCollaborator(collaborator);
                            setShowCollaboratorForm(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>

                      <Badge variant="outline" className="mb-2">
                        {collaborator.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>

                      {collaborator.institution && (
                        <p className="text-sm text-gray-600 mb-1">
                          {collaborator.institution}
                        </p>
                      )}

                      {collaborator.role && (
                        <p className="text-sm text-gray-600 mb-2">
                          {collaborator.role}
                        </p>
                      )}

                      {collaborator.bio && (
                        <p className="text-sm text-gray-700 mb-2">
                          {collaborator.bio}
                        </p>
                      )}

                      {collaborator.skills && collaborator.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {collaborator.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {collaborator.profileUrl && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="link"
                            onClick={() => handleExternalLink(collaborator.profileUrl!, 'Profile')}
                            className="p-0 h-auto text-xs"
                          >
                            View Profile <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No collaborators added yet. Click "Add Collaborator" to get started.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Media Coverage */}
          {project.mediaCoverage && project.mediaCoverage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
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
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Completed:</span>
                  <span className="ml-2 font-medium">{formatDate(project.endDate)}</span>
                </div>
              )}

              {project.category && (
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
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
}

export default ProjectDetails;