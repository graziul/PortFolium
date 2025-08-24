import React from 'react';
import { CollaboratorsManager } from '@/components/CollaboratorsManager';

export function Collaborators() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Manage Collaborators</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Add and manage your research and project collaborators.
        </p>
      </div>
      <CollaboratorsManager />
    </div>
  );
}