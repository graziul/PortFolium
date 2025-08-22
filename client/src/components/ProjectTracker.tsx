import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, Github, FileText, Lightbulb, Search, Clock, Play, CheckCircle, PauseCircle, Users, DollarSign, BookOpen } from 'lucide-react';
import { getProjects, updateProject, Project } from '@/api/projects';
import { useNavigate } from 'react-router-dom';

const ProjectTracker: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const columns = {
    ideation: {
      title: 'Ideation',
      color: 'bg-purple-50 border-purple-200',
      icon: Lightbulb,
      iconColor: 'text-purple-600'
    },
    researching: {
      title: 'Researching',
      color: 'bg-orange-50 border-orange-200',
      icon: BookOpen,
      iconColor: 'text-orange-600'
    },
    planning: {
      title: 'Planning',
      color: 'bg-yellow-50 border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-600'
    },
    'in-progress': {
      title: 'In Progress',
      color: 'bg-blue-50 border-blue-200',
      icon: Play,
      iconColor: 'text-blue-600'
    },
    completed: {
      title: 'Completed',
      color: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    'on-hold': {
      title: 'On Hold',
      color: 'bg-red-50 border-red-200',
      icon: PauseCircle,
      iconColor: 'text-red-600'
    }
  };

  const energyEmojis = {
    'Low': '😴',
    'Medium': '😊',
    'High': '🤩',
    'Very High': '🚀'
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('ProjectTracker: Fetching projects for tracker...');
      setLoading(true);
      const response = await getProjects();
      console.log('ProjectTracker: Projects fetched successfully:', response.projects.length);
      setProjects(response.projects);
    } catch (error) {
      console.error('ProjectTracker: Error fetching projects:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to fetch projects'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      console.log('ProjectTracker: No destination for drag operation');
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('ProjectTracker: Item dropped in same position');
      return;
    }

    const newStatus = destination.droppableId as Project['status'];
    const projectId = draggableId;

    try {
      console.log(`ProjectTracker: Updating project ${projectId} status to ${newStatus}`);

      // Optimistically update the UI
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId
            ? { ...project, status: newStatus }
            : project
        )
      );

      // Update the project on the backend
      await updateProject(projectId, { status: newStatus });

      console.log('ProjectTracker: Project status updated successfully');
      toast({
        title: 'Success',
        description: 'Project status updated successfully'
      });
    } catch (error) {
      console.error('ProjectTracker: Error updating project status:', error);

      // Revert the optimistic update
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId
            ? { ...project, status: source.droppableId as Project['status'] }
            : project
        )
      );

      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update project status'
      });
    }
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  const handleProjectClick = (projectId: string) => {
    console.log(`ProjectTracker: Navigating to project details: ${projectId}`);
    navigate(`/projects/${projectId}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('ProjectTracker: Image failed to load, hiding image element');
    e.currentTarget.style.display = 'none';
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Live Project Tracker</h1>
        <p className="text-gray-600 mt-1">Track your projects across different stages</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Object.entries(columns).map(([status, column]) => {
            const Icon = column.icon;
            return (
              <div key={status} className="flex flex-col">
                <div className={`p-3 rounded-t-lg border-2 ${column.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Icon className={`h-3 w-3 ${column.iconColor}`} />
                    </div>
                    <h2 className="font-semibold text-sm text-gray-800">
                      {column.title}
                    </h2>
                  </div>
                  <span className="text-xs text-gray-600">
                    {getProjectsByStatus(status).length} projects
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 border-2 border-t-0 rounded-b-lg min-h-[400px] ${
                        snapshot.isDraggingOver ? 'bg-gray-50' : 'bg-white'
                      } ${column.color.replace('bg-', 'border-').replace('-50', '-200')}`}
                    >
                      {getProjectsByStatus(status).map((project, index) => (
                        <Draggable
                          key={project._id}
                          draggableId={project._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-200 hover:border-gray-300 ${
                                snapshot.isDragging ? 'shadow-lg rotate-2 opacity-90' : ''
                              }`}
                              onClick={() => handleProjectClick(project._id)}
                            >
                              {(project.thumbnailUrl || project.imageUrl) && (
                                <div className="aspect-video overflow-hidden relative">
                                  <img
                                    src={getImageUrl(project.thumbnailUrl || project.imageUrl)}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    style={{
                                      height: '100px',
                                      objectFit: 'cover'
                                    }}
                                    onError={handleImageError}
                                    onLoad={() => {
                                      console.log('ProjectTracker: Image loaded successfully:', getImageUrl(project.thumbnailUrl || project.imageUrl));
                                    }}
                                  />
                                </div>
                              )}

                              <CardHeader className="pb-1 px-2 pt-2">
                                <CardTitle className="text-xs font-medium line-clamp-2">
                                  {project.title}
                                </CardTitle>
                              </CardHeader>

                              <CardContent className="pt-0 space-y-2 px-2 pb-2">
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                                  {project.shortDescription || project.description}
                                </p>

                                {project.enthusiasmLevel && (
                                  <div className="flex items-center gap-1 mb-2">
                                    <span className="text-sm" title={`${project.enthusiasmLevel} energy`}>
                                      {energyEmojis[project.enthusiasmLevel]}
                                    </span>
                                    <Badge variant="outline" className="text-xs px-1 py-0">
                                      {project.enthusiasmLevel}
                                    </Badge>
                                  </div>
                                )}

                                <div className="flex gap-1 flex-wrap mb-2">
                                  {project.openToCollaborators && (
                                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-1 py-0">
                                      <Users className="h-2 w-2" />
                                      Collaborators
                                    </Badge>
                                  )}
                                  {project.acceptingSponsors && (
                                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-1 py-0">
                                      <DollarSign className="h-2 w-2" />
                                      Sponsors
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-1 mb-2">
                                  {project.technologies.slice(0, 2).map((tech) => (
                                    <Badge
                                      key={tech}
                                      variant="secondary"
                                      className="text-xs px-1 py-0"
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                  {project.technologies.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-1 py-0"
                                    >
                                      +{project.technologies.length - 2}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex gap-1">
                                  {project.liveUrl && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-5 px-1 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(project.liveUrl, '_blank');
                                      }}
                                    >
                                      <ExternalLink className="w-2 h-2 mr-1" />
                                      Live
                                    </Button>
                                  )}
                                  {project.githubUrl && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-5 px-1 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(project.githubUrl, '_blank');
                                      }}
                                    >
                                      <Github className="w-2 h-2 mr-1" />
                                      Code
                                    </Button>
                                  )}
                                  {project.paperUrl && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-5 px-1 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(project.paperUrl, '_blank');
                                      }}
                                    >
                                      <FileText className="w-2 h-2 mr-1" />
                                      Paper
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectTracker;