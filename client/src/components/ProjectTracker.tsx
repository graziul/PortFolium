import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, Github, FileText } from 'lucide-react';
import { getProjects, updateProject, Project } from '@/api/projects';
import { useNavigate } from 'react-router-dom';

const ProjectTracker: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const columns = {
    planning: { title: 'Planning', color: 'bg-yellow-100 border-yellow-300' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-100 border-blue-300' },
    completed: { title: 'Completed', color: 'bg-green-100 border-green-300' },
    'on-hold': { title: 'On Hold', color: 'bg-red-100 border-red-300' }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects for tracker...');
      setLoading(true);
      const response = await getProjects();
      console.log('Projects fetched successfully:', response.projects.length);
      setProjects(response.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      console.log('No destination for drag operation');
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('Item dropped in same position');
      return;
    }

    const newStatus = destination.droppableId as Project['status'];
    const projectId = draggableId;

    try {
      console.log(`Updating project ${projectId} status to ${newStatus}`);
      
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
      
      console.log('Project status updated successfully');
      toast({
        title: 'Success',
        description: 'Project status updated successfully'
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      
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
    console.log(`Navigating to project details: ${projectId}`);
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Live Project Tracker</h1>
        <p className="text-gray-600 mt-2">Track your projects across different stages</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([status, column]) => (
            <div key={status} className="flex flex-col">
              <div className={`p-4 rounded-t-lg border-2 ${column.color}`}>
                <h2 className="font-semibold text-lg text-gray-800">
                  {column.title}
                </h2>
                <span className="text-sm text-gray-600">
                  {getProjectsByStatus(status).length} projects
                </span>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 border-2 border-t-0 rounded-b-lg min-h-[400px] ${
                      snapshot.isDraggingOver ? 'bg-gray-50' : 'bg-white'
                    } ${column.color.replace('bg-', 'border-').replace('-100', '-300')}`}
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
                            className={`mb-4 cursor-pointer transition-shadow hover:shadow-md ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                            onClick={() => handleProjectClick(project._id)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium line-clamp-2">
                                {project.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {project.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {project.technologies.slice(0, 2).map((tech) => (
                                  <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="text-xs px-2 py-0"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                                {project.technologies.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-0"
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
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(project.liveUrl, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Live
                                  </Button>
                                )}
                                {project.githubUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(project.githubUrl, '_blank');
                                    }}
                                  >
                                    <Github className="w-3 h-3 mr-1" />
                                    Code
                                  </Button>
                                )}
                                {project.paperUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(project.paperUrl, '_blank');
                                    }}
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
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
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectTracker;