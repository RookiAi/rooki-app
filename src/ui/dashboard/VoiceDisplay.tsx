import React from 'react';
import { Heading } from "~/components/heading";
import { Text, Strong } from "~/components/text";
import { Button } from "~/components/button";

interface VoiceDisplayProps {
  positioning: string | null;
  tone: any | null;
  onEditToggle: () => void;
}

const VoiceDisplay: React.FC<VoiceDisplayProps> = ({ positioning, tone, onEditToggle }) => {
  // Format tone for display if it's an object
  const formatTone = (tone: any): string => {
    if (!tone) return 'No tone set';
    if (typeof tone === 'string') return tone;
    
    try {
      // Handle when tone is a JSON object
      return JSON.stringify(tone, null, 2);
    } catch (e) {
      return 'Invalid tone format';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading level={2} className="mb-4">Your Voice</Heading>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Positioning:</Strong>
        <Text className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 block dark:bg-gray-700 dark:text-gray-200">
          {positioning || 'No positioning set'}
        </Text>
      </div>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Tone:</Strong>
        <pre className="whitespace-pre-wrap overflow-x-auto rounded-md bg-gray-50 p-3 text-sm text-zinc-500 dark:bg-gray-700 dark:text-gray-200">
          {formatTone(tone)}
        </pre>
      </div>
      
      <Button onClick={onEditToggle} className="mt-2">
        Edit Voice
      </Button>
    </div>
  );
};

export default VoiceDisplay;