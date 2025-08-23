import React, { useState } from "react";
import { Heading } from "~/components/heading";
import { Text, Strong } from "~/components/text";
import { Button } from "~/components/button";
import { Textarea } from "~/components/textarea";
import { Input } from "~/components/input";
import { Fieldset } from "~/components/fieldset";
import { Divider } from "~/components/divider";

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
  
  // Parse the tone object if it's a string
  const parseTone = () => {
    if (!tone) return {};
    
    if (typeof tone === 'string') {
      try {
        return JSON.parse(tone);
      } catch (e) {
        return { style: tone };
      }
    }
    
    return tone;
  };
  
  const parsedTone = parseTone();
  
  // Extract tone properties or set defaults
  const [style, setStyle] = useState(parsedTone.style || '');
  const [formality, setFormality] = useState(parsedTone.formality || '');
  const [personality, setPersonality] = useState(parsedTone.personality || '');
  
  // For advanced mode editing
  const [editableTone, setEditableTone] = useState(
    JSON.stringify(parsedTone, null, 2) || '{}'
  );
  
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedTone;
    
    if (isAdvancedMode) {
      // Use the raw JSON editor
      try {
        updatedTone = JSON.parse(editableTone);
      } catch (error) {
        alert("Invalid JSON format. Please check your syntax.");
        return;
      }
    } else {
      // Use the form fields
      updatedTone = {
        ...parsedTone,
        style,
        formality,
        personality
      };
    }

    onUpdate({
      positioning: editablePositioning,
      tone: updatedTone
    });
  };

  const toggleAdvancedMode = () => {
    if (!isAdvancedMode) {
      // Switching to advanced mode, update the JSON string with current form values
      const currentTone = {
        ...parsedTone,
        style,
        formality,
        personality
      };
      setEditableTone(JSON.stringify(currentTone, null, 2));
    }
    setIsAdvancedMode(!isAdvancedMode);
  };

  const handleCancel = () => {
    onUpdate({
      positioning: positioning || '',
      tone: tone || ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading level={2} className="mb-4">Edit Your Voice Profile</Heading>
      
      <div className="mb-6">
        <Strong className="mb-1 block">Positioning Statement:</Strong>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Describe how you want your brand to be positioned in the market.
        </Text>
        <Textarea
          value={editablePositioning}
          onChange={(e) => setEditablePositioning(e.target.value)}
          className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          rows={4}
        />
      </div>
      
      <Divider />
      
      <div className="my-6">
        <div className="flex justify-between items-center mb-3">
          <Strong>Tone Characteristics:</Strong>
          <Button 
            type="button" 
            onClick={toggleAdvancedMode}
            className="text-xs py-1"
          >
            {isAdvancedMode ? "Simple Mode" : "Advanced Mode"}
          </Button>
        </div>
        
        {!isAdvancedMode ? (
          <Fieldset className="space-y-4">
            <div>
              <Strong className="mb-1 block text-sm">Style:</Strong>
              <Input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="e.g., casual, professional, technical"
              />
            </div>
            
            <div>
              <Strong className="mb-1 block text-sm">Formality:</Strong>
              <Input
                value={formality}
                onChange={(e) => setFormality(e.target.value)}
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="e.g., formal, semi-formal, informal"
              />
            </div>
            
            <div>
              <Strong className="mb-1 block text-sm">Personality:</Strong>
              <Input
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder="e.g., friendly, authoritative, playful"
              />
            </div>
          </Fieldset>
        ) : (
          <div>
            <Strong className="mb-1 block">Raw JSON Configuration:</Strong>
            <Textarea
              value={editableTone}
              onChange={(e) => setEditableTone(e.target.value)}
              className="mt-1 block w-full font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows={10}
            />
            <Text className="mt-2 text-sm text-zinc-400 dark:text-zinc-300">
              Use valid JSON format. Example: {"{"}"style": "professional", "formality": "formal"{"}"}
            </Text>
          </div>
        )}
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