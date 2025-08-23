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
    <div className="rounded-2xl bg-white overflow-hidden p-8 dark:bg-gray-800 shadow-xl">
      <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Intern's Voice Profile</Heading>
      
      <div className="mb-8">
        <Strong className="block text-lg text-gray-700 dark:text-gray-300 mb-3">Positioning Statement</Strong>
        <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700 dark:text-gray-200 shadow-inner">
          <Text className="whitespace-pre-wrap text-xl leading-relaxed font-medium">
            {positioning || 'No positioning set'}
          </Text>
        </div>
      </div>
      
      <div className="mb-8">
        <Strong className="block text-lg text-gray-700 dark:text-gray-300 mb-3">Tone Characteristics</Strong>
        {toneAttributes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toneAttributes.map((attr, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex flex-col shadow-sm">
                <Badge className="self-start mb-2 text-base px-3 py-1">{attr.label}</Badge>
                <Text className="text-lg text-gray-800 dark:text-gray-200 font-medium">{attr.value}</Text>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700 flex items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-lg">No tone characteristics defined</Text>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <Strong className="block text-lg text-gray-700 dark:text-gray-300 mb-3">Raw Configuration</Strong>
        <div className="rounded-xl overflow-hidden">
          <pre className="whitespace-pre-wrap overflow-x-auto bg-gray-50 p-6 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-mono shadow-inner">
            {formatTone(tone)}
          </pre>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={onEditToggle} 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Edit Voice Profile
        </Button>
      </div>
    </div>
  );
};

export default VoiceDisplay;