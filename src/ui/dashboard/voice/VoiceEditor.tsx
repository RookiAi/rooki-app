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
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white overflow-hidden p-8 shadow-xl">
      <Heading level={2} className="text-3xl font-bold text-gray-900 mb-8">
        Edit Your Intern's Voice Profile
      </Heading>
      
      <div className="mb-10">
        <Strong className="block text-lg text-gray-700 mb-3">Positioning Statement</Strong>
        <Text className="text-base text-gray-600 mb-4">
          Describe how you want your brand to be positioned in the market. This helps our AI understand your brand's mission and values.
        </Text>
        <Textarea
          value={editablePositioning}
          onChange={(e) => setEditablePositioning(e.target.value)}
          className="w-full text-lg p-4 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          rows={6}
        />
      </div>
      
      <Divider className="my-8 border-gray-200" />
      
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <Strong className="text-lg text-gray-700">Tone Characteristics</Strong>
          <Button 
            type="button" 
            onClick={toggleAdvancedMode}
            className="px-4 py-2 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isAdvancedMode ? "Simple Mode" : "Advanced Mode"}
          </Button>
        </div>
        
        <Text className="text-base text-gray-600 mb-4">
          Define how your intern should communicate by setting their style, formality, and personality traits.
        </Text>
        
        {!isAdvancedMode ? (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <Strong className="block text-base text-gray-700 mb-3">Style</Strong>
              <Input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full text-lg p-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., casual, professional, technical"
              />
              <Text className="mt-2 text-sm text-gray-500">
                The overall style of your writing
              </Text>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <Strong className="block text-base text-gray-700 mb-3">Formality</Strong>
              <Input
                value={formality}
                onChange={(e) => setFormality(e.target.value)}
                className="w-full text-lg p-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., formal, semi-formal, informal"
              />
              <Text className="mt-2 text-sm text-gray-500">
                How formal or informal your writing should be
              </Text>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
              <Strong className="block text-base text-gray-700 mb-3">Personality</Strong>
              <Input
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full text-lg p-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., friendly, authoritative, playful"
              />
              <Text className="mt-2 text-sm text-gray-500">
                The personality traits that should come across in your writing
              </Text>
            </div>
          </div>
        ) : (
          <div>
            <Strong className="block text-lg text-gray-700 dark:text-gray-300 mb-3">Raw JSON Configuration</Strong>
            <Textarea
              value={editableTone}
              onChange={(e) => setEditableTone(e.target.value)}
              className="w-full font-mono text-base p-4 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows={12}
            />
            <Text className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Use valid JSON format. Example: {"{"}"style": "professional", "formality": "formal"{"}"}
            </Text>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-4 mt-10">
        <Button 
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Save Changes
        </Button>
        <Button 
          type="button" 
          onClick={handleCancel} 
          className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full text-lg font-medium border border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default VoiceEditor;