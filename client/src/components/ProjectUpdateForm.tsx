import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { addProjectUpdate } from '@/api/projects';
import { toast } from 'sonner';

interface ProjectUpdateFormProps {
  projectId: string;
  onUpdateAdded: () => void;
  onCancel: () => void;
}

interface UpdateFormData {
  type: 'question' | 'blocker' | 'update';
  content: string;
  blockerType?: 'Code' | 'Use Case' | 'Interest' | 'Funding' | 'Ethics';
  blockerDetails?: string;
}

export const ProjectUpdateForm: React.FC<ProjectUpdateFormProps> = ({
  projectId,
  onUpdateAdded,
  onCancel
}) => {
  console.log('ProjectUpdateForm: Component rendering with projectId:', projectId);

  const [formData, setFormData] = useState<UpdateFormData>({
    type: 'update',
    content: '',
    blockerType: undefined,
    blockerDetails: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: keyof UpdateFormData, value: string) => {
    console.log('ProjectUpdateForm: Input change:', field, '=', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (type: 'question' | 'blocker' | 'update') => {
    console.log('ProjectUpdateForm: Type change:', type);
    setFormData(prev => ({
      ...prev,
      type,
      blockerType: type === 'blocker' ? 'Code' : undefined,
      blockerDetails: type === 'blocker' ? prev.blockerDetails : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProjectUpdateForm: Form submission started');
    console.log('ProjectUpdateForm: Form data:', formData);

    if (!formData.content.trim()) {
      console.log('ProjectUpdateForm: Validation failed - missing content');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter update content"
      });
      return;
    }

    if (formData.type === 'blocker' && !formData.blockerType) {
      console.log('ProjectUpdateForm: Validation failed - missing blocker type');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a blocker type"
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('ProjectUpdateForm: Submitting update...');

      const updateData = {
        type: formData.type,
        content: formData.content,
        ...(formData.type === 'blocker' && {
          blockerType: formData.blockerType,
          blockerDetails: formData.blockerDetails
        })
      };

      const response = await addProjectUpdate(projectId, updateData);
      console.log('ProjectUpdateForm: Update response:', response);

      toast({
        title: "Success",
        description: "Update added successfully"
      });

      // Reset form
      setFormData({
        type: 'update',
        content: '',
        blockerType: undefined,
        blockerDetails: ''
      });

      console.log('ProjectUpdateForm: Calling onUpdateAdded callback');
      onUpdateAdded();
    } catch (error) {
      console.error('ProjectUpdateForm: Error submitting update:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add update"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getUpdateTypeLabel = (type: string) => {
    switch (type) {
      case 'question':
        return 'Current Question';
      case 'blocker':
        return 'Current Blocker';
      case 'update':
        return 'Project Update';
      default:
        return 'Update';
    }
  };

  const getUpdateTypePlaceholder = (type: string) => {
    switch (type) {
      case 'question':
        return 'What question are you currently trying to answer?';
      case 'blocker':
        return 'What is currently blocking your progress?';
      case 'update':
        return 'Share an update about your project progress...';
      default:
        return 'Enter your update...';
    }
  };

  console.log('ProjectUpdateForm: Rendering form with data:', formData);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Project Update
        </CardTitle>
        <CardDescription>
          Share your progress, questions, or blockers with your audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Update Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Update Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select update type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update">Project Update</SelectItem>
                <SelectItem value="question">Current Question</SelectItem>
                <SelectItem value="blocker">Current Blocker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Blocker Type (only for blockers) */}
          {formData.type === 'blocker' && (
            <div className="space-y-2">
              <Label htmlFor="blockerType">Blocker Type</Label>
              <Select 
                value={formData.blockerType} 
                onValueChange={(value) => handleInputChange('blockerType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blocker type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Code">Code</SelectItem>
                  <SelectItem value="Use Case">Use Case</SelectItem>
                  <SelectItem value="Interest">Interest</SelectItem>
                  <SelectItem value="Funding">Funding</SelectItem>
                  <SelectItem value="Ethics">Ethics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Update Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              {getUpdateTypeLabel(formData.type)} *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder={getUpdateTypePlaceholder(formData.type)}
              rows={4}
              required
            />
          </div>

          {/* Blocker Details (only for blockers) */}
          {formData.type === 'blocker' && (
            <div className="space-y-2">
              <Label htmlFor="blockerDetails">Additional Details</Label>
              <Textarea
                id="blockerDetails"
                value={formData.blockerDetails}
                onChange={(e) => handleInputChange('blockerDetails', e.target.value)}
                placeholder="Provide more context about this blocker..."
                rows={3}
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Adding Update...' : 'Add Update'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};