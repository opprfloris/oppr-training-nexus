
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BuilderHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  title,
  setTitle,
  description,
  setDescription
}) => {
  return (
    <div className="mb-6 space-y-4">
      <Input
        placeholder="Training Definition Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-semibold"
        required
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
    </div>
  );
};

export default BuilderHeader;
