import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Users, Building, User, ExternalLink } from 'lucide-react';
import { getCollaborators, deleteCollaborator, Collaborator } from '@/api/collaborators';
import { CollaboratorForm } from './CollaboratorForm';
import { useToast } from '@/hooks/useToast';

const collaboratorTypeLabels = {
  'postdoc': 'Postdoc',
  'junior_faculty': 'Junior Faculty',
  'senior_faculty': 'Senior Faculty',
  'industry_tech': 'Industry - Tech',
  'industry_finance': 'Industry - Finance',
  'industry_healthcare': 'Industry - Healthcare',
  'undergraduate': 'Undergraduate Student',
  'graduate': 'Graduate Student',
  'professional_ethicist': 'Professional Ethicist',
  'journalist': 'Journalist'
};

const collaboratorTypeColors = {
  'postdoc': 'bg-blue-100 text-blue-800',
  'junior_faculty': 'bg-green-100 text-green-800',
  'senior_faculty': 'bg-purple-100 text-purple-800',
  'industry_tech': 'bg-orange-100 text-orange-800',
  'industry_finance': 'bg-yellow-100 text-yellow-800',
  'industry_healthcare': 'bg-red-100 text-red-800',
  'undergraduate': 'bg-cyan-100 text-cyan-800',
  'graduate': 'bg-indigo-100 text-indigo-800',
  'professional_ethicist': 'bg-pink-100 text-pink-800',
  'journalist': 'bg-gray-100 text-gray-800'
};

export function CollaboratorsManager() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | undefined>();
  const [deletingCollaborator, setDeletingCollaborator] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      console.log('CollaboratorsManager: Fetching collaborators...');
      setLoading(true);
      const response = await getCollaborators();
      setCollaborators(response.collaborators);
      console.log('CollaboratorsManager: Collaborators loaded successfully:', response.collaborators.length);
    } catch (error) {
      console.error('CollaboratorsManager: Error fetching collaborators:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch collaborators.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCollaborator(undefined);
    fetchCollaborators();
  };

  const handleEdit = (collaborator: Collaborator) => {
    console.log('CollaboratorsManager: Editing collaborator:', collaborator.name);
    setEditingCollaborator(collaborator);
    setShowForm(true);
  };

  const handleDelete = async (collaboratorId: string) => {
    setDeletingCollaborator(collaboratorId);
    try {
      console.log('CollaboratorsManager: Deleting collaborator:', collaboratorId);
      await deleteCollaborator(collaboratorId);
      toast({
        title: 'Success',
        description: 'Collaborator deleted successfully.'
      });
      fetchCollaborators();
    } catch (error) {
      console.error('CollaboratorsManager: Error deleting collaborator:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete collaborator.',
        variant: 'destructive'
      });
    } finally {
      setDeletingCollaborator(null);
    }
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaborators ({collaborators.length})
            </CardTitle>
            <CardDescription>
              Manage your research and project collaborators
            </CardDescription>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
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
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCollaborator(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {collaborators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborators.map((collaborator) => (
              <Card key={collaborator._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{collaborator.name}</h4>
                      <Badge
                        className={`${collaboratorTypeColors[collaborator.type]} text-xs mt-2`}
                      >
                        {collaboratorTypeLabels[collaborator.type]}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(collaborator)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Collaborator</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{collaborator.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(collaborator._id)}
                              disabled={deletingCollaborator === collaborator._id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingCollaborator === collaborator._id ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collaborator.institution && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span>{collaborator.institution}</span>
                    </div>
                  )}

                  {collaborator.role && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{collaborator.role}</span>
                    </div>
                  )}

                  {collaborator.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collaborator.bio}
                    </p>
                  )}

                  {collaborator.skills && collaborator.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {collaborator.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {collaborator.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{collaborator.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {collaborator.profileUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExternalLink(collaborator.profileUrl!)}
                      className="w-full"
                    >
                      <ExternalLink className="h-3 w-3 mr-2" />
                      View Profile
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collaborators yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your network by adding your first collaborator.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Collaborator
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}