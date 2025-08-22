import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle, AlertTriangle, FileText, Calendar, Lightbulb } from 'lucide-react';
import { ProjectUpdate } from '@/api/projects';
import { addProjectUpdate, getProjectUpdates } from '@/api/projects';
import { useToast } from '@/hooks/useToast';

interface ProjectTimelineProps {
  projectId: string;
  initialUpdates?: ProjectUpdate[];
}

interface UpdateFormData {
  type: 'question' | 'blocker' | 'update' | 'findings';
  content: string;
  blockerType?: 'Code' | 'Use Case' | 'Interest' | 'Funding' | 'Ethics';
  blockerDetails?: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId }) => {
  console.log('ProjectTimeline: Component mounting with projectId:', projectId);

  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateFormData>({
    type: 'update',
    content: '',
    blockerType: undefined,
    blockerDetails: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log('ProjectTimeline: useEffect triggered for projectId:', projectId);
    fetchUpdates();
  }, [projectId]);

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

  const handleTypeChange = (type: 'question' | 'blocker' | 'update' | 'findings') => {
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
      case 'findings':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'blocker':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'update':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'findings':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <CardDescription>
              Track questions, blockers, updates, and findings for this project
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant={showAddForm ? "outline" : "default"}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add Update'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Update Form */}
        {showAddForm && (
          <Card className="border-dashed border-2 border-blue-200 bg-blue-50/30">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Update Type</Label>
                  <Select value={formData.type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select update type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Current Question</SelectItem>
                      <SelectItem value="blocker">Current Blocker</SelectItem>
                      <SelectItem value="update">Project Update</SelectItem>
                      <SelectItem value="findings">Preliminary Findings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'blocker' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Blocker Type</Label>
                    <Select
                      value={formData.blockerType}
                      onValueChange={(value) => handleInputChange('blockerType', value)}
                    >
                      <SelectTrigger className="bg-white">
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
                  <Label className="text-sm font-medium">Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder={
                      formData.type === 'question'
                        ? "What question are you currently trying to answer?"
                        : formData.type === 'blocker'
                        ? "Describe the blocker you're facing..."
                        : formData.type === 'findings'
                        ? "Share your preliminary findings or insights..."
                        : "Share an update about your project progress..."
                    }
                    rows={3}
                    required
                    className="bg-white resize-none"
                  />
                </div>

                {formData.type === 'blocker' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Additional Details (Optional)</Label>
                    <Textarea
                      value={formData.blockerDetails}
                      onChange={(e) => handleInputChange('blockerDetails', e.target.value)}
                      placeholder="Any additional context or details about this blocker..."
                      rows={2}
                      className="bg-white resize-none"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0"
                  >
                    {submitting ? 'Adding...' : 'Add Update'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <div className="text-gray-600">Loading updates...</div>
            </div>
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your project progress by adding your first update!</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Update
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={update._id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full border-2 shadow-sm ${getUpdateColor(update.type)} transition-all hover:scale-105`}>
                    {getUpdateIcon(update.type)}
                  </div>
                  {index < updates.length - 1 && (
                    <div className="w-0.5 h-20 bg-gradient-to-b from-gray-300 to-gray-200 mt-3 rounded-full" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className={`${getUpdateColor(update.type)} font-medium px-3 py-1`}>
                      {update.type === 'question' && 'Question'}
                      {update.type === 'blocker' && 'Blocker'}
                      {update.type === 'update' && 'Update'}
                      {update.type === 'findings' && 'Findings'}
                    </Badge>
                    {update.type === 'blocker' && update.blockerType && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                        {update.blockerType}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDate(update.createdAt)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {update.content}
                    </p>
                    {update.type === 'blocker' && update.blockerDetails && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-xs font-semibold text-red-700 mb-1 uppercase tracking-wide">
                          Additional Details:
                        </p>
                        <p className="text-sm text-red-800 leading-relaxed whitespace-pre-wrap">
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