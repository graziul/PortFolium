import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { ProjectUpdate } from '@/api/projects';
import { addProjectUpdate, getProjectUpdates } from '@/api/projects';
import { toast } from 'sonner';

interface ProjectTimelineProps {
  projectId: string;
  initialUpdates?: ProjectUpdate[];
}

interface UpdateFormData {
  type: 'question' | 'blocker' | 'update';
  content: string;
  blockerType?: 'Code' | 'Use Case' | 'Interest' | 'Funding' | 'Ethics';
  blockerDetails?: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId, initialUpdates = [] }) => {
  console.log('ProjectTimeline: Component mounting with projectId:', projectId);

  const [updates, setUpdates] = useState<ProjectUpdate[]>(initialUpdates);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateFormData>({
    type: 'update',
    content: '',
    blockerType: undefined,
    blockerDetails: ''
  });

  useEffect(() => {
    if (initialUpdates.length === 0) {
      console.log('ProjectTimeline: No initial updates provided, fetching from API');
      fetchUpdates();
    } else {
      console.log('ProjectTimeline: Using initial updates:', initialUpdates.length);
      setUpdates(initialUpdates);
    }
  }, [projectId, initialUpdates]);

  const fetchUpdates = async () => {
    console.log('ProjectTimeline: fetchUpdates called for projectId:', projectId);
    try {
      setLoading(true);
      const response = await getProjectUpdates(projectId);
      console.log('ProjectTimeline: Updates fetched:', response);
      
      if (response.updates) {
        setUpdates(response.updates);
        console.log('ProjectTimeline: Updates set:', response.updates.length);
      }
    } catch (error) {
      console.error('ProjectTimeline: Error fetching updates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load project updates"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateFormData, value: string) => {
    console.log('ProjectTimeline: Input change:', field, '=', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (type: 'question' | 'blocker' | 'update') => {
    console.log('ProjectTimeline: Type change:', type);
    setFormData(prev => ({
      ...prev,
      type,
      blockerType: type === 'blocker' ? 'Code' : undefined,
      blockerDetails: type === 'blocker' ? prev.blockerDetails : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProjectTimeline: Form submission started with data:', formData);

    if (!formData.content.trim()) {
      console.log('ProjectTimeline: Validation failed - empty content');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter update content"
      });
      return;
    }

    if (formData.type === 'blocker' && !formData.blockerType) {
      console.log('ProjectTimeline: Validation failed - missing blocker type');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a blocker type"
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('ProjectTimeline: Submitting update...');

      const updateData = {
        type: formData.type,
        content: formData.content,
        ...(formData.type === 'blocker' && {
          blockerType: formData.blockerType,
          blockerDetails: formData.blockerDetails
        })
      };

      const response = await addProjectUpdate(projectId, updateData);
      console.log('ProjectTimeline: Update added:', response);

      if (response.update) {
        setUpdates(prev => [response.update, ...prev]);
        setFormData({
          type: 'update',
          content: '',
          blockerType: undefined,
          blockerDetails: ''
        });
        setShowAddForm(false);
        console.log('ProjectTimeline: Update added to timeline');
        
        toast({
          title: "Success",
          description: "Update added successfully"
        });
      }
    } catch (error) {
      console.error('ProjectTimeline: Error adding update:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add update"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log('ProjectTimeline: Cancel button clicked');
    setShowAddForm(false);
    setFormData({
      type: 'update',
      content: '',
      blockerType: undefined,
      blockerDetails: ''
    });
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <MessageCircle className="h-4 w-4" />;
      case 'blocker':
        return <AlertTriangle className="h-4 w-4" />;
      case 'update':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocker':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'update':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('ProjectTimeline: Error formatting date:', error);
      return 'Invalid date';
    }
  };

  console.log('ProjectTimeline: Rendering with', updates.length, 'updates, showAddForm:', showAddForm);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Live Tracker
            </CardTitle>
            <CardDescription>
              Track questions, blockers, and updates for this project
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant={showAddForm ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add Update'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Update Form */}
        {showAddForm && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Update Type</Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select update type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Current Question</SelectItem>
                      <SelectItem value="blocker">Current Blocker</SelectItem>
                      <SelectItem value="update">Project Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'blocker' && (
                  <div className="space-y-2">
                    <Label>Blocker Type</Label>
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

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder={
                      formData.type === 'question' 
                        ? "What question are you currently trying to answer?"
                        : formData.type === 'blocker'
                        ? "Describe the blocker you're facing..."
                        : "Share an update about your project progress..."
                    }
                    rows={3}
                    required
                  />
                </div>

                {formData.type === 'blocker' && (
                  <div className="space-y-2">
                    <Label>Additional Details (Optional)</Label>
                    <Textarea
                      value={formData.blockerDetails}
                      onChange={(e) => handleInputChange('blockerDetails', e.target.value)}
                      placeholder="Any additional context or details about this blocker..."
                      rows={2}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? 'Adding...' : 'Add Update'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading updates...</div>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No updates yet. Click the "+" button to add your first update!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update, index) => (
              <div key={update._id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full border-2 ${getUpdateColor(update.type)}`}>
                    {getUpdateIcon(update.type)}
                  </div>
                  {index < updates.length - 1 && (
                    <div className="w-px h-16 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getUpdateColor(update.type)}>
                      {update.type === 'question' && 'Question'}
                      {update.type === 'blocker' && 'Blocker'}
                      {update.type === 'update' && 'Update'}
                    </Badge>
                    {update.type === 'blocker' && update.blockerType && (
                      <Badge variant="secondary">
                        {update.blockerType}
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(update.createdAt)}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {update.content}
                    </p>
                    {update.type === 'blocker' && update.blockerDetails && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Additional Details:
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {update.blockerDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};