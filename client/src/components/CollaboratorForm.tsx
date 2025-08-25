import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createCollaborator, updateCollaborator, Collaborator } from '@/api/collaborators';
import { useToast } from '@/hooks/useToast';

interface CollaboratorFormProps {
  collaborator?: Collaborator;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const collaboratorTypes = [
  { value: 'postdoc', label: 'Postdoc' },
  { value: 'junior_faculty', label: 'Junior Faculty' },
  { value: 'senior_faculty', label: 'Senior Faculty' },
  { value: 'industry_tech', label: 'Industry - Tech' },
  { value: 'industry_finance', label: 'Industry - Finance' },
  { value: 'industry_healthcare', label: 'Industry - Healthcare' },
  { value: 'undergraduate', label: 'Undergraduate Student' },
  { value: 'graduate', label: 'Graduate Student' },
  { value: 'professional_ethicist', label: 'Professional Ethicist' },
  { value: 'journalist', label: 'Journalist' }
];

export function CollaboratorForm({ collaborator, onSuccess, onCancel }: CollaboratorFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: collaborator?.name || '',
    type: collaborator?.type || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.type) {
      toast({
        title: 'Validation Error',
        description: 'Name and type are required fields.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        type: formData.type,
        isActive: true
      };

      if (collaborator) {
        await updateCollaborator(collaborator._id, submitData);
        toast({
          title: 'Success',
          description: 'Collaborator updated successfully.'
        });
      } else {
        await createCollaborator(submitData);
        toast({
          title: 'Success',
          description: 'Collaborator created successfully.'
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving collaborator:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save collaborator.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{collaborator ? 'Edit Collaborator' : 'Add New Collaborator'}</CardTitle>
        <CardDescription>
          {collaborator ? 'Update collaborator information' : 'Add a new collaborator to your network'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Category *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select collaborator category" />
              </SelectTrigger>
              <SelectContent>
                {collaboratorTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : collaborator ? 'Update Collaborator' : 'Create Collaborator'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}