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
  Plus,
  Lightbulb,
  Search,
  Clock,
  Play,
  CheckCircle,
  PauseCircle,
  Users,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { getProjects, updateProject, deleteProject, Project } from '../api/projects';
import { useToast } from '../hooks/useToast';

// Main workflow columns (excluding on-hold)
const mainStatusColumns = {
  ideation: {
    title: 'Ideation',
    color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    icon: Lightbulb,
    iconColor: 'text-purple-600'
  },
  researching: {
    title: 'Researching',
    color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
    icon: Search,
    iconColor: 'text-orange-600'
  },
  planning: {
    title: 'Planning',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    icon: Clock,
    iconColor: 'text-blue-600'
  },
  'in-progress': {
    title: 'In Progress',
    color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    icon: Play,
    iconColor: 'text-yellow-600'
  },
  completed: {
    title: 'Completed',
    color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  }
};

// On-hold section (separate)
const onHoldColumn = {
  'on-hold': {
    title: 'On Hold',
    color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    icon: PauseCircle,
    iconColor: 'text-red-600'
  }
};

// Enthusiasm indicators with cleaner visual design
const enthusiasmIndicators = {
  'Low': { emoji: '😴', title: 'Low enthusiasm', color: 'bg-gray-100 text-gray-600' },
  'Medium': { emoji: '😊', title: 'Medium enthusiasm', color: 'bg-blue-100 text-blue-600' },
  'High': { emoji: '🤩', title: 'High enthusiasm', color: 'bg-orange-100 text-orange-600' },
  'Very High': { emoji: '🚀', title: 'Very high enthusiasm', color: 'bg-red-100 text-red-600' }
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
      setLoading(true);
      const response = await getProjects() as { projects: Project[] };
      console.log('ProjectTracker: Received projects:', response.projects.length);

      const activeProjects = response.projects.filter(project => !(project as any).archived);
      const archived = response.projects.filter(project => (project as any).archived);

      setProjects(activeProjects);
      setArchivedProjects(archived);

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
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStatus = destination.droppableId as Project['status'];
    const projectId = draggableId;

    try {
      const updatedProjects = projects.map(project => {
        if (project._id === projectId) {
          return { ...project, status: newStatus };
        }
        return project;
      });

      setProjects(updatedProjects);
      await updateProject(projectId, { status: newStatus });

      toast({
        title: "Success",
        description: "Project status updated successfully.",
      });
    } catch (error) {
      console.error('ProjectTracker: Error updating project status:', error);
      fetchProjects();
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    }
  }, [projects, toast]);

  const handleEdit = useCallback((projectId: string) => {
    navigate(`/projects/edit/${projectId}`);
  }, [navigate]);

  const handleView = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  const handleDelete = useCallback(async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
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
      await updateProject(projectId, { archived: true } as any);
      const projectToArchive = projects.find(p => p._id === projectId);
      if (projectToArchive) {
        setProjects(prev => prev.filter(p => p._id !== projectId));
        setArchivedProjects(prev => [...prev, { ...projectToArchive, archived: true } as any]);
      }
      toast({
        title: "Success",
        description: "Project archived successfully.",
      });
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
      await updateProject(projectId, { archived: false } as any);
      const projectToRestore = archivedProjects.find(p => p._id === projectId);
      if (projectToRestore) {
        setArchivedProjects(prev => prev.filter(p => p._id !== projectId));
        setProjects(prev => [...prev, { ...projectToRestore, archived: false } as any]);
      }
      toast({
        title: "Success",
        description: "Project restored successfully.",
      });
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

  const ProjectCard = React.memo(({ project, index, isHorizontal = false }: { project: Project; index: number; isHorizontal?: boolean }) => {
    const enthusiasmConfig = project.enthusiasmLevel ? enthusiasmIndicators[project.enthusiasmLevel] : null;

    return (
      <Draggable draggableId={project._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${isHorizontal ? 'mr-4 flex-shrink-0 w-80' : 'mb-3'} ${snapshot.isDragging ? 'rotate-2 shadow-2xl scale-105' : ''}`}
          >
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 hover:border-gray-300"
              onClick={() => handleView(project._id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-2">
                    <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {project.title}
                    </CardTitle>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleView(project._id);
                      }}>
                        <Eye className="h-3 w-3 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project._id);
                      }}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(project._id);
                      }}>
                        <Archive className="h-3 w-3 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project._id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Enthusiasm Level */}
                {enthusiasmConfig && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${enthusiasmConfig.color} flex items-center gap-1`}>
                      <span>{enthusiasmConfig.emoji}</span>
                      <span>My enthusiasm</span>
                    </div>
                  </div>
                )}

                {/* Collaboration Indicators */}
                <div className="flex gap-1 flex-wrap">
                  {project.openToCollaborators && (
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Users className="h-3 w-3 mr-1" />
                      Open to Collaborators
                    </Badge>
                  )}
                  {project.acceptingSponsors && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Accepting Sponsors
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-2">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 2).map((tech, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-0 text-gray-600 border-gray-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0 text-gray-500 border-gray-300"
                      >
                        +{project.technologies.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-1 pt-1">
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.liveUrl, '_blank');
                      }}
                      className="h-6 px-2 text-xs border-gray-300 hover:bg-gray-50"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Demo
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
                      className="h-6 px-2 text-xs border-gray-300 hover:bg-gray-50"
                    >
                      <GitBranch className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.paperUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.paperUrl, '_blank');
                      }}
                      className="h-6 px-2 text-xs border-gray-300 hover:bg-gray-50"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Paper
                    </Button>
                  )}
                </div>

                {project.startDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 pt-1 border-t border-gray-100">
                    <Calendar className="h-3 w-3" />
                    <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  });

  const StatusColumn = React.memo(({ status, title, projects: columnProjects, icon: Icon, iconColor }: {
    status: Project['status'];
    title: string;
    projects: Project[];
    icon: React.ComponentType<any>;
    iconColor: string;
  }) => {
    return (
      <div className="flex-1 min-w-0">
        <div className={`rounded-lg p-3 min-h-[500px] ${mainStatusColumns[status]?.color || 'bg-gray-50'} border`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Icon className={`h-3 w-3 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
                <span className="text-xs text-gray-600">
                  {columnProjects.length} project{columnProjects.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects/new')}
              className="h-6 w-6 p-0 hover:bg-white/80"
            >
              <Plus className="h-3 w-3 text-gray-600" />
            </Button>
          </div>

          <Droppable droppableId={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[400px] transition-all duration-200 rounded ${
                  snapshot.isDraggingOver ? 'bg-white/50' : ''
                }`}
              >
                {columnProjects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
                {provided.placeholder}

                {columnProjects.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <div className="w-8 h-8 mx-auto mb-2 bg-white/80 rounded-full flex items-center justify-center">
                      <Icon className={`h-4 w-4 ${iconColor} opacity-50`} />
                    </div>
                    <div className="text-xs mb-2">No projects yet</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/projects/new')}
                      className="text-xs bg-white/80 hover:bg-white"
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

  const OnHoldSection = React.memo(() => {
    const onHoldProjects = getProjectsByStatus('on-hold');
    const { icon: Icon, iconColor, color } = onHoldColumn['on-hold'];

    return (
      <div className="mt-4">
        <div className={`rounded-lg p-3 ${color} border`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Icon className={`h-3 w-3 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">On Hold</h3>
                <span className="text-xs text-gray-600">
                  {onHoldProjects.length} project{onHoldProjects.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects/new')}
              className="h-6 w-6 p-0 hover:bg-white/80"
            >
              <Plus className="h-3 w-3 text-gray-600" />
            </Button>
          </div>

          <Droppable droppableId="on-hold" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[200px] transition-all duration-200 rounded ${
                  snapshot.isDraggingOver ? 'bg-white/50' : ''
                }`}
              >
                {onHoldProjects.length > 0 ? (
                  <div className="flex overflow-x-auto pb-2 space-x-0">
                    {onHoldProjects.map((project, index) => (
                      <ProjectCard key={project._id} project={project} index={index} isHorizontal={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <div className="w-8 h-8 mx-auto mb-2 bg-white/80 rounded-full flex items-center justify-center">
                      <Icon className={`h-4 w-4 ${iconColor} opacity-50`} />
                    </div>
                    <div className="text-xs mb-2">No projects on hold</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/projects/new')}
                      className="text-xs bg-white/80 hover:bg-white"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add project
                    </Button>
                  </div>
                )}
                {provided.placeholder}
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

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Project Tracker</h1>
          <p className="text-sm text-gray-600">
            Drag and drop projects between columns to update their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
            className="bg-white"
          >
            <Archive className="h-3 w-3 mr-1" />
            {showArchived ? 'Hide' : 'Show'} Archived ({archivedProjects.length})
          </Button>
          <Button
            onClick={() => navigate('/projects/new')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Project
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
          {Object.entries(mainStatusColumns).map(([status, column]) => (
            <StatusColumn
              key={status}
              status={status as Project['status']}
              title={column.title}
              projects={getProjectsByStatus(status as Project['status'])}
              icon={column.icon}
              iconColor={column.iconColor}
            />
          ))}
        </div>

        <OnHoldSection />
      </DragDropContext>

      {showArchived && archivedProjects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {archivedProjects.map((project) => (
              <Card key={project._id} className="opacity-75 hover:opacity-100 transition-opacity bg-white border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex-1">
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
                          <Eye className="h-3 w-3 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRestore(project._id)}>
                          <ArchiveRestore className="h-3 w-3 mr-2" />
                          Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
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