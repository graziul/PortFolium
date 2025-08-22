import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Github, Calendar, Clock, Users, Star, ArrowRight, FileText, Plus, Edit, Trash2, Rocket, Terminal, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getProjects, deleteProject, Project } from '@/api/projects';
import { useToast } from '@/hooks/useToast';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const { toast } = useToast();

  const fuse = new Fuse(projects, {
    keys: ['title', 'description', 'technologies'],
    threshold: 0.3,
  });

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const response = await getProjects();
      const allProjects = response.projects;

      // Sort projects to show featured projects first
      const sortedProjects = allProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });

      setProjects(sortedProjects);
      setFilteredProjects(sortedProjects);
      console.log('Projects loaded successfully');
    } catch (error: any) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      filtered = searchResults.map(result => result.item);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    // Sort filtered results to maintain featured projects first
    filtered = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, categoryFilter, projects, fuse]);

  const handleDeleteProject = async (projectId: string) => {
    setDeletingProject(projectId);
    try {
      console.log('Deleting project:', projectId);
      await deleteProject(projectId);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      // Refresh the projects list
      await fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingProject(null);
    }
  };

  const categories = [...new Set(projects.map(p => p.category))];

  const impactColors = {
    'transformative': 'border-l-red-500',
    'innovative': 'border-l-yellow-500',
    'foundational': 'border-l-green-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Project Portfolio
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore my collection of projects, from web applications to mobile apps and design systems.
        </p>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-1 items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-gray-800/80"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white/80 dark:bg-gray-800/80">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="researching">Researching</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-white/80 dark:bg-gray-800/80">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild>
            <Link to="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link to="/project-tracker">
              Live Tracker <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05, duration: 0.6 }}
          >
            <Card className={`group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 h-full border-l-4 ${impactColors[project.impact || 'foundational']}`}>
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.thumbnailUrl || project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{
                    minHeight: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover'
                  }}
                  onLoad={(e) => {
                    const imgElement = e.currentTarget;
                    console.log('Projects: Image loaded successfully:', imgElement.src);
                    console.log('Projects: Image natural dimensions:', imgElement.naturalWidth, 'x', imgElement.naturalHeight);
                    console.log('Projects: Image display dimensions:', imgElement.width, 'x', imgElement.height);
                  }}
                  onError={(e) => {
                    const imgElement = e.currentTarget;
                    console.error('Projects: Image failed to load:', imgElement.src);
                    console.error('Projects: Image error event:', e);

                    // Try to fetch the image directly
                    fetch(imgElement.src)
                      .then(response => {
                        console.error('Projects: Direct fetch response status:', response.status);
                        console.error('Projects: Direct fetch response headers:', response.headers);
                        return response.blob();
                      })
                      .then(blob => {
                        console.error('Projects: Direct fetch blob size:', blob.size);
                        console.error('Projects: Direct fetch blob type:', blob.type);
                      })
                      .catch(fetchError => {
                        console.error('Projects: Direct fetch failed:', fetchError);
                      });

                    // Set a fallback image or hide the image
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge
                    variant={
                      project.status === 'completed' ? 'default' :
                      project.status === 'in-progress' ? 'secondary' : 'outline'
                    }
                    className="bg-white/90 dark:bg-gray-900/90"
                  >
                    {project.status}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" asChild>
                    <Link to={`/projects/edit/${project._id}`}>
                      <Edit className="h-3 w-3" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{project.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project._id)}
                          disabled={deletingProject === project._id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingProject === project._id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/projects/${project._id}`}>
                      <CardTitle className="text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                        {project.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="text-sm">{project.shortDescription || project.description}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  {project.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{project.duration}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  {project.impact && (
                    <span className="text-muted-foreground capitalize">
                      {project.impact} impact
                    </span>
                  )}
                  {project.collaboratorCount && (
                    <span className="text-muted-foreground">
                      Collaborators: {project.collaboratorCount}
                    </span>
                  )}
                </div>

                {project.openToCollaborators && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Open to collaborators
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  {(project.liveUrl || project.demoUrl) && (
                    <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-colors group" asChild>
                      <a href={project.liveUrl || project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Rocket className="h-3 w-3 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-blue-600 font-medium">Demo</span>
                      </a>
                    </Button>
                  )}
                  {(project.githubUrl || project.codeUrl) && (
                    <Button size="sm" variant="outline" className="flex-1 hover:bg-gray-50 hover:border-gray-400 transition-colors group" asChild>
                      <a href={project.githubUrl || project.codeUrl} target="_blank" rel="noopener noreferrer">
                        <Terminal className="h-3 w-3 mr-2 text-gray-700 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-700 font-medium">Code</span>
                      </a>
                    </Button>
                  )}
                  {project.paperUrl && (
                    <Button size="sm" variant="outline" className="flex-1 hover:bg-purple-50 hover:border-purple-300 transition-colors group" asChild>
                      <a href={project.paperUrl} target="_blank" rel="noopener noreferrer">
                        <GraduationCap className="h-3 w-3 mr-2 text-purple-600 group-hover:scale-110 transition-transform" />
                        <span className="text-purple-600 font-medium">Paper</span>
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
          <Button asChild className="mt-4">
            <Link to="/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}