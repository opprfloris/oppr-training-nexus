
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PublishVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  definitionId: string;
  currentVersion: string;
  onPublishSuccess: () => void;
}

const PublishVersionModal: React.FC<PublishVersionModalProps> = ({
  isOpen,
  onClose,
  definitionId,
  currentVersion,
  onPublishSuccess
}) => {
  const [versionType, setVersionType] = useState<'minor' | 'major'>('minor');
  const [customVersion, setCustomVersion] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [useCustomVersion, setUseCustomVersion] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();

  const getNextVersion = (current: string, type: 'minor' | 'major'): string => {
    // If current version is 0.1 (initial draft), first publish should be 1.0
    if (current === '0.1') {
      return '1.0';
    }
    
    const [major, minor] = current.split('.').map(Number);
    if (type === 'major') {
      return `${major + 1}.0`;
    }
    return `${major}.${minor + 1}`;
  };

  const suggestedVersion = getNextVersion(currentVersion, versionType);

  const handlePublish = async () => {
    const finalVersion = useCustomVersion ? customVersion : suggestedVersion;
    
    if (!finalVersion.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify a version number",
        variant: "destructive"
      });
      return;
    }

    try {
      setPublishing(true);

      // Check if there's a draft version to publish
      const { data: draftVersion, error: fetchError } = await supabase
        .from('training_definition_versions')
        .select('*')
        .eq('training_definition_id', definitionId)
        .eq('status', 'draft')
        .single();

      if (fetchError) {
        toast({
          title: "Error",
          description: "No draft version found to publish. Please save your changes first.",
          variant: "destructive"
        });
        return;
      }

      // Check if version already exists
      const { data: existingVersion } = await supabase
        .from('training_definition_versions')
        .select('id')
        .eq('training_definition_id', definitionId)
        .eq('version_number', finalVersion)
        .maybeSingle();

      if (existingVersion) {
        toast({
          title: "Version Exists",
          description: `Version ${finalVersion} already exists for this definition`,
          variant: "destructive"
        });
        return;
      }

      // Update the draft version to published
      const { error: publishError } = await supabase
        .from('training_definition_versions')
        .update({
          status: 'published',
          version_number: finalVersion,
          version_notes: versionNotes.trim() || null,
          published_at: new Date().toISOString()
        })
        .eq('id', draftVersion.id);

      if (publishError) throw publishError;

      toast({
        title: "Success",
        description: `Version ${finalVersion} published successfully`,
      });

      onPublishSuccess();
      onClose();
    } catch (error) {
      console.error('Error publishing version:', error);
      toast({
        title: "Error",
        description: "Failed to publish version",
        variant: "destructive"
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setVersionType('minor');
    setCustomVersion('');
    setVersionNotes('');
    setUseCustomVersion(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish New Version</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Version Increment</Label>
            <Select 
              value={versionType} 
              onValueChange={(value: 'minor' | 'major') => setVersionType(value)}
              disabled={useCustomVersion}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor ({getNextVersion(currentVersion, 'minor')})</SelectItem>
                <SelectItem value="major">Major ({getNextVersion(currentVersion, 'major')})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useCustomVersion"
              checked={useCustomVersion}
              onChange={(e) => setUseCustomVersion(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="useCustomVersion">Use custom version number</Label>
          </div>

          {useCustomVersion && (
            <div>
              <Label htmlFor="customVersion">Custom Version</Label>
              <Input
                id="customVersion"
                value={customVersion}
                onChange={(e) => setCustomVersion(e.target.value)}
                placeholder="e.g., 2.1, 1.5.0"
              />
            </div>
          )}

          <div>
            <Label htmlFor="versionNotes">Version Notes (Optional)</Label>
            <Textarea
              id="versionNotes"
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              placeholder="Describe what's new in this version..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">
              <strong>Publishing version:</strong> {useCustomVersion ? customVersion || 'Custom' : suggestedVersion}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This will make the current draft available for use in training projects.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={publishing}
            className="oppr-button-primary"
          >
            {publishing ? 'Publishing...' : 'Publish Version'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishVersionModal;
