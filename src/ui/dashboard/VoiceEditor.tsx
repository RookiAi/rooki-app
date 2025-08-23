import React, { useState } from "react";
import { Heading } from "~/components/heading";
import { Text, Strong } from "~/components/text";
import { Button } from "~/components/button";
import { Textarea } from "~/components/textarea";

interface VoiceEditorProps {
  positioning: string | null;
  tone: any | null;
  onUpdate: (updatedVoice: { positioning: string; tone: any }) => void;
}

const VoiceEditor: React.FC<VoiceEditorProps> = ({ 
  positioning, 
  tone, 
  onUpdate 
}) => {
  const [editablePositioning, setEditablePositioning] = useState(positioning || '');
  const [editableTone, setEditableTone] = useState(
    typeof tone === 'string' ? tone : JSON.stringify(tone, null, 2) || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Try to parse the tone if it's a JSON string
    let parsedTone = editableTone;
    try {
      parsedTone = JSON.parse(editableTone);
    } catch (error) {
      // If it's not valid JSON, keep it as a string
    }

    onUpdate({
      positioning: editablePositioning,
      tone: parsedTone
    });
  };

  const handleCancel = () => {
    onUpdate({
      positioning: positioning || '',
      tone: tone || ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading level={2} className="mb-4">Edit Your Voice</Heading>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Positioning:</Strong>
        <Textarea
          value={editablePositioning}
          onChange={(e) => setEditablePositioning(e.target.value)}
          className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          rows={4}
        />
      </div>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Tone:</Strong>
        <Textarea
          value={editableTone}
          onChange={(e) => setEditableTone(e.target.value)}
          className="mt-1 block w-full font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          rows={8}
        />
        <Text className="mt-2 text-sm text-zinc-400 dark:text-zinc-300">
          JSON format accepted for structured tone settings
        </Text>
      </div>
      
      <div className="flex space-x-3">
        <Button type="submit">Save Changes</Button>
        <Button type="button" onClick={handleCancel} className="border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default VoiceEditor;