import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getProjects, deleteProject, Project } from '@/api/projects';
import { useToast } from '@/hooks/useToast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fuse = new Fuse(projects, {
    keys: ['title', 'description', 'technologies'],
    threshold: 0.3,
  });

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      const allProjects = response.projects;
      const sortedProjects = allProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      setProjects(sortedProjects);
      setFilteredProjects(sortedProjects);
    } catch (error: any) {
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
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== 'all') {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      filtered = searchResults.map(result => result.item);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

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
      await deleteProject(projectId);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      await fetchProjects();
    } catch (error: any) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Projects Portfolio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore my collection of projects and developments.
        </p>
      </motion.div>

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
              Live Tracker <Activity className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

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
            <Card
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 h-full cursor-pointer"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.thumbnailUrl ? `http://localhost:3000${project.thumbnailUrl}` : "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge
                    variant={project.status === 'completed' ? 'default' : project.status === 'in-progress' ? 'secondary' : 'outline'}
                    className="bg-white/90 dark:bg-gray-900/90"
                  >
                    {project.status}
                  </Badge>
                </div>

                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/edit/${project._id}`);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                <CardTitle className="text-lg hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm">{project.shortDescription || project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
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