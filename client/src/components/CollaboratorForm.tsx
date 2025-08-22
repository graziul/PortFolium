import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
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
    email: collaborator?.email || '',
    type: collaborator?.type || '',
    institution: collaborator?.institution || '',
    role: collaborator?.role || '',
    profileUrl: collaborator?.profileUrl || '',
    bio: collaborator?.bio || '',
    skills: collaborator?.skills || []
  });
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.type) {
      toast({
        title: 'Validation Error',
        description: 'Name, email, and type are required fields.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      if (collaborator) {
        await updateCollaborator(collaborator._id, formData);
        toast({
          title: 'Success',
          description: 'Collaborator updated successfully.'
        });
      } else {
        await createCollaborator(formData);
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{collaborator ? 'Edit Collaborator' : 'Add New Collaborator'}</CardTitle>
        <CardDescription>
          {collaborator ? 'Update collaborator information' : 'Add a new collaborator to your network'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collaborator type" />
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

            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="Institution or company"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Job title or role"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileUrl">Profile URL</Label>
              <Input
                id="profileUrl"
                type="url"
                value={formData.profileUrl}
                onChange={(e) => handleInputChange('profileUrl', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Brief description of the collaborator"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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