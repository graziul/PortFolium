import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { createSkill, updateSkill, getSkillCategories, Skill } from '@/api/skills';
import { useToast } from '@/hooks/useToast';

interface SkillFormProps {
  skill?: Skill;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const experienceLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

export function SkillForm({ skill, onSuccess, trigger }: SkillFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newRelatedSkill, setNewRelatedSkill] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    experienceLevel: 'beginner' as const,
    yearsOfExperience: 0,
    description: '',
    relatedSkills: [] as string[],
    certifications: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        experienceLevel: skill.experienceLevel,
        yearsOfExperience: skill.yearsOfExperience,
        description: skill.description || '',
        relatedSkills: skill.relatedSkills || [],
        certifications: skill.certifications || []
      });
    }
  }, [skill]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getSkillCategories();
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load skill categories",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (skill) {
        await updateSkill(skill._id, formData);
        toast({
          title: "Success",
          description: "Skill updated successfully",
        });
      } else {
        await createSkill(formData);
        toast({
          title: "Success",
          description: "Skill created successfully",
        });
      }

      setOpen(false);
      onSuccess();
      
      if (!skill) {
        setFormData({
          name: '',
          category: '',
          experienceLevel: 'beginner',
          yearsOfExperience: 0,
          description: '',
          relatedSkills: [],
          certifications: []
        });
      }
    } catch (error: any) {
      console.error('Error saving skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRelatedSkill = () => {
    if (newRelatedSkill.trim() && !formData.relatedSkills.includes(newRelatedSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        relatedSkills: [...prev.relatedSkills, newRelatedSkill.trim()]
      }));
      setNewRelatedSkill('');
    }
  };

  const removeRelatedSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      relatedSkills: prev.relatedSkills.filter(s => s !== skillToRemove)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {skill ? 'Update your skill information' : 'Add a new skill to your portfolio'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., JavaScript, React, Python"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your experience with this skill..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Related Skills</Label>
            <div className="flex gap-2">
              <Input
                value={newRelatedSkill}
                onChange={(e) => setNewRelatedSkill(e.target.value)}
                placeholder="Add related skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRelatedSkill())}
              />
              <Button type="button" onClick={addRelatedSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.relatedSkills.map((relatedSkill) => (
                <Badge key={relatedSkill} variant="secondary" className="flex items-center gap-1">
                  {relatedSkill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeRelatedSkill(relatedSkill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {skill ? 'Update' : 'Create'} Skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}