import React from 'react';
import { Heading } from "~/components/heading";
import { Text, Strong } from "~/components/text";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";

interface VoiceDisplayProps {
  positioning: string | null;
  tone: any | null;
  onEditToggle: () => void;
}

const VoiceDisplay: React.FC<VoiceDisplayProps> = ({ positioning, tone, onEditToggle }) => {
  // Format tone for display if it's an object
  const formatTone = (tone: any): string => {
    if (!tone) return 'No tone set';
    if (typeof tone === 'string') {
      try {
        return JSON.stringify(JSON.parse(tone), null, 2);
      } catch (e) {
        return tone;
      }
    }
    
    try {
      // Handle when tone is a JSON object
      return JSON.stringify(tone, null, 2);
    } catch (e) {
      return 'Invalid tone format';
    }
  };

  // Extract tone attributes for display
  const getToneAttributes = (): { label: string; value: string }[] => {
    let attributes: { label: string; value: string }[] = [];
    let parsedTone = tone;
    
    if (typeof tone === 'string') {
      try {
        parsedTone = JSON.parse(tone);
      } catch (e) {
        // If not valid JSON, just show the string
        return [{ label: 'Raw Tone', value: tone }];
      }
    }
    
    if (typeof parsedTone === 'object' && parsedTone !== null) {
      // Extract top-level keys
      Object.entries(parsedTone).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          attributes.push({ label: key, value: JSON.stringify(value) });
        } else {
          attributes.push({ label: key, value: String(value) });
        }
      });
    }
    
    return attributes;
  };

  const toneAttributes = getToneAttributes();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading level={2} className="mb-4">Your Voice Profile</Heading>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Positioning Statement:</Strong>
        <Text className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 block dark:bg-gray-700 dark:text-gray-200">
          {positioning || 'No positioning set'}
        </Text>
      </div>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Tone Characteristics:</Strong>
        {toneAttributes.length > 0 ? (
          <div className="space-y-2">
            {toneAttributes.map((attr, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Badge>{attr.label}</Badge>
                <Text className="text-sm">{attr.value}</Text>
              </div>
            ))}
          </div>
        ) : (
          <Text className="text-gray-500 dark:text-gray-400">No tone characteristics defined</Text>
        )}
      </div>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Raw Tone Configuration:</Strong>
        <pre className="whitespace-pre-wrap overflow-x-auto rounded-md bg-gray-50 p-3 text-sm text-zinc-500 dark:bg-gray-700 dark:text-gray-200">
          {formatTone(tone)}
        </pre>
      </div>
      
      <Button onClick={onEditToggle} className="mt-2">
        Edit Voice Profile
      </Button>
    </div>
  );
};

export default VoiceDisplay;