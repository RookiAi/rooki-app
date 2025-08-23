import React from "react";
import { Heading } from "~/components/heading";
import { Text, Strong } from "~/components/text";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";

interface VoiceDisplayProps {
  positioning: string | null;
  tone: any | null;
  onEditToggle: () => void;
}

const VoiceDisplay: React.FC<VoiceDisplayProps> = ({
  positioning,
  tone,
  onEditToggle,
}) => {
  // Format tone for display if it's an object
  const formatTone = (tone: any): string => {
    if (!tone) return "No tone set";
    if (typeof tone === "string") {
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
      return "Invalid tone format";
    }
  };

  // Extract tone attributes for display
  const getToneAttributes = (): { label: string; value: string }[] => {
    let attributes: { label: string; value: string }[] = [];
    let parsedTone = tone;

    if (typeof tone === "string") {
      try {
        parsedTone = JSON.parse(tone);
      } catch (e) {
        // If not valid JSON, just show the string
        return [{ label: "Raw Tone", value: tone }];
      }
    }

    if (typeof parsedTone === "object" && parsedTone !== null) {
      // Extract top-level keys
      Object.entries(parsedTone).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
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
    <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl relative">
      <div className="absolute top-8 right-8">
        <Button onClick={onEditToggle}>Edit Voice Profile</Button>
      </div>
      
      <Heading level={2} className="mb-8 text-3xl font-bold text-gray-900 pr-36">
        Your Intern's Voice Profile
      </Heading>

      <div className="mb-8">
        <Strong className="mb-3 block text-lg text-gray-700">
          Positioning Statement
        </Strong>
        <div className="rounded-xl bg-gray-50 p-6 shadow-inner">
          <Text className="text-xl leading-relaxed font-medium whitespace-pre-wrap">
            {positioning || "No positioning set"}
          </Text>
        </div>
      </div>

      <div className="mb-8">
        <Strong className="mb-3 block text-lg text-gray-700">
          Tone Characteristics
        </Strong>
        {toneAttributes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {toneAttributes.map((attr, index) => (
              <div
                key={index}
                className="flex flex-col rounded-xl bg-gray-50 p-4 shadow-sm"
              >
                <Badge className="mb-2 self-start px-3 py-1 text-base">
                  {attr.label}
                </Badge>
                <Text className="text-lg font-medium text-gray-800">
                  {attr.value}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl bg-gray-50 p-6">
            <Text className="text-lg text-gray-500">
              No tone characteristics defined
            </Text>
          </div>
        )}
      </div>

      {/* <div className="mb-8">
        <Strong className="mb-3 block text-lg text-gray-700">
          Raw Configuration
        </Strong>
        <div className="overflow-hidden rounded-xl">
          <pre className="overflow-x-auto bg-gray-50 p-6 font-mono text-sm whitespace-pre-wrap text-gray-600 shadow-inner">
            {formatTone(tone)}
          </pre>
        </div>
      </div> */}
    </div>
  );
};

export default VoiceDisplay;
