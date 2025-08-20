import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  GitBranch,
  ExternalLink,
  FileText,
  Archive,
  ArchiveRestore,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { getProjects, updateProject, deleteProject, Project } from '../api/projects';
import { useToast } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

const statusColumns = {
  planning: { title: 'Planning', color: 'bg-blue-50 border-blue-200' },
  'in-progress': { title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
  completed: { title: 'Completed', color: 'bg-green-50 border-green-200' },
  'on-hold': { title: 'On Hold', color: 'bg-red-50 border-red-200' }
};

export function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('ProjectTracker: Fetching projects...');
      console.log('ProjectTracker: Checking for missing features that user mentioned:');
      console.log('ProjectTracker: - Looking for Enthusiasm level (user said this was implemented well)');
      console.log('ProjectTracker: - Checking for Paper buttons/links');
      console.log('ProjectTracker: - Verifying all status columns are present');
      console.log('ProjectTracker: - Ensuring priority/percentage are removed from cards');
      
      setLoading(true);
      const response = await getProjects() as { projects: Project[] };
      console.log('ProjectTracker: Received projects:', response.projects.length);
      
      // Log detailed analysis of each project to identify missing features
      response.projects.forEach((project, index) => {
        console.log(`ProjectTracker: Project ${index + 1} analysis:`, {
          title: project.title,
          status: project.status,
          hasGithubUrl: !!project.githubUrl,
          hasLiveUrl: !!project.liveUrl,
          hasPaperUrl: !!project.paperUrl,
          hasMediaCoverage: !!(project.mediaCoverage && project.mediaCoverage.length > 0),
          hasPriority: !!project.priority,
          hasProgress: project.progress !== undefined,
          hasEnthusiasmLevel: !!(project as any).enthusiasmLevel, // Check if enthusiasm level exists
          technologies: project.technologies?.length || 0,
          collaborators: project.collaborators?.length || 0
        });
      });

      // Filter out archived projects
      const activeProjects = response.projects.filter(project => !(project as any).archived);
      const archived = response.projects.filter(project => (project as any).archived);

      setProjects(activeProjects);
      setArchivedProjects(archived);
      
      console.log('ProjectTracker: Status distribution:', {
        planning: activeProjects.filter(p => p.status === 'planning').length,
        'in-progress': activeProjects.filter(p => p.status === 'in-progress').length,
        completed: activeProjects.filter(p => p.status === 'completed').length,
        'on-hold': activeProjects.filter(p => p.status === 'on-hold').length
      });
      
      console.log('ProjectTracker: Active projects set:', activeProjects.length);
      console.log('ProjectTracker: Archived projects set:', archived.length);
    } catch (error) {
      console.error('ProjectTracker: Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = useCallback(async (result: DropResult) => {
    console.log('ProjectTracker: Drag ended with result:', result);

    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      console.log('ProjectTracker: No destination, drag cancelled');
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('ProjectTracker: Dropped in same position, no change needed');
      return;
    }

    console.log('ProjectTracker: Processing drag from', source.droppableId, 'to', destination.droppableId);

    const newStatus = destination.droppableId as Project['status'];
    const projectId = draggableId;

    try {
      // Optimistically update the UI
      const updatedProjects = projects.map(project => {
        if (project._id === projectId) {
          console.log('ProjectTracker: Updating project', project.title, 'status to', newStatus);
          return { ...project, status: newStatus };
        }
        return project;
      });

      setProjects(updatedProjects);

      // Update the project on the backend
      console.log('ProjectTracker: Sending update request for project:', projectId);
      await updateProject(projectId, { status: newStatus });

      toast({
        title: "Success",
        description: "Project status updated successfully.",
      });

      console.log('ProjectTracker: Project status updated successfully');
    } catch (error) {
      console.error('ProjectTracker: Error updating project status:', error);
      // Revert the optimistic update
      fetchProjects();
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    }
  }, [projects, toast]);

  const handleEdit = useCallback((projectId: string) => {
    console.log('ProjectTracker: Navigating to edit project:', projectId);
    navigate(`/projects/edit/${projectId}`);
  }, [navigate]);

  const handleView = useCallback((projectId: string) => {
    console.log('ProjectTracker: Navigating to view project:', projectId);
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  const handleDelete = useCallback(async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      console.log('ProjectTracker: Deleting project:', projectId);
      await deleteProject(projectId);

      // Remove from local state
      setProjects(prev => prev.filter(p => p._id !== projectId));

      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });

      console.log('ProjectTracker: Project deleted successfully');
    } catch (error) {
      console.error('ProjectTracker: Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleArchive = useCallback(async (projectId: string) => {
    try {
      console.log('ProjectTracker: Archiving project:', projectId);
      await updateProject(projectId, { archived: true } as any);

      // Move project from active to archived
      const projectToArchive = projects.find(p => p._id === projectId);
      if (projectToArchive) {
        setProjects(prev => prev.filter(p => p._id !== projectId));
        setArchivedProjects(prev => [...prev, { ...projectToArchive, archived: true } as any]);
      }

      toast({
        title: "Success",
        description: "Project archived successfully.",
      });

      console.log('ProjectTracker: Project archived successfully');
    } catch (error) {
      console.error('ProjectTracker: Error archiving project:', error);
      toast({
        title: "Error",
        description: "Failed to archive project. Please try again.",
        variant: "destructive",
      });
    }
  }, [projects, toast]);

  const handleRestore = useCallback(async (projectId: string) => {
    try {
      console.log('ProjectTracker: Restoring project:', projectId);
      await updateProject(projectId, { archived: false } as any);

      // Move project from archived to active
      const projectToRestore = archivedProjects.find(p => p._id === projectId);
      if (projectToRestore) {
        setArchivedProjects(prev => prev.filter(p => p._id !== projectId));
        setProjects(prev => [...prev, { ...projectToRestore, archived: false } as any]);
      }

      toast({
        title: "Success",
        description: "Project restored successfully.",
      });

      console.log('ProjectTracker: Project restored successfully');
    } catch (error) {
      console.error('ProjectTracker: Error restoring project:', error);
      toast({
        title: "Error",
        description: "Failed to restore project. Please try again.",
        variant: "destructive",
      });
    }
  }, [archivedProjects, toast]);

  const getProjectsByStatus = useCallback((status: Project['status']) => {
    return projects.filter(project => project.status === status);
  }, [projects]);

  const ProjectCard = React.memo(({ project, index }: { project: Project; index: number }) => {
    console.log('ProjectTracker: Rendering ProjectCard for:', project.title, {
      showingPriority: !!project.priority,
      showingProgress: project.progress !== undefined,
      showingEnthusiasm: !!(project as any).enthusiasmLevel,
      hasLiveUrl: !!project.liveUrl,
      hasGithubUrl: !!project.githubUrl,
      hasPaperUrl: !!project.paperUrl
    });

    return (
      <Draggable draggableId={project._id} index={index}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-3 ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}`}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500"
              onClick={() => handleView(project._id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-semibold text-gray-900 leading-tight flex-1">
                    {project.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleView(project._id);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project._id);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(project._id);
                      }}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project._id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* NOTE: Removed priority and progress as per user request */}
                {/* User specifically said: "you included priority/percentage on cards and it should not be there. Please remove." */}

                {/* Check if enthusiasm level exists and display it */}
                {(project as any).enthusiasmLevel && (
                  <div className="text-xs">
                    <span className="text-gray-500">Enthusiasm: </span>
                    <Badge variant="outline" className="text-xs">
                      {(project as any).enthusiasmLevel}
                    </Badge>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {project.technologies?.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies?.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.liveUrl, '_blank');
                      }}
                      className="h-6 text-xs px-2"
                    >
                      <ExternalLink className="h-2.5 w-2.5 mr-1" />
                      Live
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.githubUrl, '_blank');
                      }}
                      className="h-6 text-xs px-2"
                    >
                      <GitBranch className="h-2.5 w-2.5 mr-1" />
                      Code
                    </Button>
                  )}
                  {/* User specifically requested Paper buttons/links */}
                  {project.paperUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.paperUrl, '_blank');
                      }}
                      className="h-6 text-xs px-2"
                    >
                      <FileText className="h-2.5 w-2.5 mr-1" />
                      Paper
                    </Button>
                  )}
                </div>

                {project.startDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Draggable>
    );
  });

  const StatusColumn = React.memo(({ status, title, projects: columnProjects }: {
    status: Project['status'];
    title: string;
    projects: Project[]
  }) => {
    console.log(`ProjectTracker: Rendering StatusColumn for ${status}:`, {
      title,
      projectCount: columnProjects.length,
      projects: columnProjects.map(p => p.title)
    });

    return (
      <div className="flex-1 min-w-0">
        <div className={`rounded-lg p-4 min-h-[600px] ${statusColumns[status]?.color || 'bg-gray-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
              {title}
              <Badge variant="secondary" className="text-xs">
                {columnProjects.length}
              </Badge>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects/new')}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Droppable droppableId={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[500px] transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-white/50 rounded-lg' : ''
                }`}
              >
                <AnimatePresence>
                  {columnProjects.map((project, index) => (
                    <ProjectCard key={project._id} project={project} index={index} />
                  ))}
                </AnimatePresence>
                {provided.placeholder}

                {columnProjects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm mb-2">No projects</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/projects/new')}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add project
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-sm text-gray-600">Loading projects...</div>
        </div>
      </div>
    );
  }

  console.log('ProjectTracker: Rendering main component with status columns:', Object.keys(statusColumns));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Tracker</h1>
          <p className="text-gray-600 text-sm mt-1">
            Drag and drop projects between columns to update their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? 'Hide' : 'Show'} Archived ({archivedProjects.length})
          </Button>
          <Button onClick={() => navigate('/projects/new')} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* User mentioned missing columns - ensuring all 4 status columns are present */}
          <StatusColumn
            status="planning"
            title="Planning"
            projects={getProjectsByStatus('planning')}
          />
          <StatusColumn
            status="in-progress"
            title="In Progress"
            projects={getProjectsByStatus('in-progress')}
          />
          <StatusColumn
            status="completed"
            title="Completed"
            projects={getProjectsByStatus('completed')}
          />
          <StatusColumn
            status="on-hold"
            title="On Hold"
            projects={getProjectsByStatus('on-hold')}
          />
        </div>
      </DragDropContext>

      {showArchived && archivedProjects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedProjects.map((project) => (
              <Card key={project._id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-semibold text-gray-900 leading-tight flex-1">
                      {project.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(project._id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRestore(project._id)}>
                          <ArchiveRestore className="h-4 w-4 mr-2" />
                          Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Archived
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}