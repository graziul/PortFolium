import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BriefcaseIcon, 
  GraduationCapIcon, 
  CodeIcon, 
  TrophyIcon,
  CalendarIcon
} from 'lucide-react';
import { 
  getTimelineEvents, 
  createTimelineEvent, 
  updateTimelineEvent, 
  deleteTimelineEvent,
  type TimelineEvent,
  type CreateTimelineEventData 
} from '@/api/timeline';
import { useToast } from '@/hooks/useToast';

interface CareerTimelineProps {
  className?: string;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({ className = '' }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const { toast } = useToast();

  const [eventForm, setEventForm] = useState<CreateTimelineEventData>({
    title: '',
    description: '',
    date: '',
    type: 'milestone',
    category: '',
    metadata: {}
  });

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      setIsLoading(true);
      const response = await getTimelineEvents();
      // Sort events by date (newest first)
      const sortedEvents = response.events.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast({
        title: "Error",
        description: "Failed to load timeline events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    try {
      const newEvent = await createTimelineEvent(eventForm);
      setEvents(prev => [newEvent, ...prev].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      resetForm();
      setShowEventDialog(false);
      toast({
        title: "Success",
        description: "Timeline event added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add timeline event",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    
    try {
      const updatedEvent = await updateTimelineEvent(editingEvent._id, eventForm);
      setEvents(prev => prev.map(event => 
        event._id === editingEvent._id ? updatedEvent : event
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      resetForm();
      setShowEventDialog(false);
      setEditingEvent(null);
      toast({
        title: "Success",
        description: "Timeline event updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update timeline event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteTimelineEvent(eventId);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      toast({
        title: "Success",
        description: "Timeline event deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete timeline event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      type: 'milestone',
      category: '',
      metadata: {}
    });
  };

  const openEditDialog = (event: TimelineEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0], // Format for date input
      type: event.type,
      category: event.category,
      metadata: event.metadata || {}
    });
    setShowEventDialog(true);
  };

  const openAddDialog = () => {
    setEditingEvent(null);
    resetForm();
    setShowEventDialog(true);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return <BriefcaseIcon className="w-4 h-4" />;
      case 'education':
        return <GraduationCapIcon className="w-4 h-4" />;
      case 'project':
        return <CodeIcon className="w-4 h-4" />;
      case 'milestone':
        return <TrophyIcon className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'bg-blue-500';
      case 'education':
        return 'bg-green-500';
      case 'project':
        return 'bg-purple-500';
      case 'milestone':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Career Trajectory
            </CardTitle>
            <Button variant="outline" size="sm" onClick={openAddDialog}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative flex items-start gap-4"
                  >
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getEventColor(event.type)} text-white shadow-lg`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-500 mb-2">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditDialog(event)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {event.type}
                          </Badge>
                          <Badge variant="outline">
                            {event.category}
                          </Badge>
                          {event.metadata?.technologies?.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No timeline events yet.</p>
              <p className="text-sm">Add your first career milestone!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Timeline Event' : 'Add Timeline Event'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Event description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="event-type">Type</Label>
                <Select 
                  value={eventForm.type} 
                  onValueChange={(value: any) => setEventForm({ ...eventForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="event-category">Category</Label>
              <Input
                id="event-category"
                value={eventForm.category}
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                placeholder="e.g., Web Development, Career, Education"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Cancel
            </Button>
            <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};