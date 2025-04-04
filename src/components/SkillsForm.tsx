
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skill } from "@/types/resume";
import { Sparkles, Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";
import { enhanceSkills } from "@/services/aiService";
import { toast } from "sonner";

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  apiKey: string;
}

const SkillsForm = ({ skills, onChange, apiKey }: SkillsFormProps) => {
  const [skillInput, setSkillInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      const newSkill: Skill = {
        id: uuidv4(),
        name: skillInput.trim(),
      };
      onChange([...skills, newSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSuggestedSkill = (skill: string) => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: skill,
    };
    onChange([...skills, newSkill]);
    setSuggestedSkills(suggestedSkills.filter((s) => s !== skill));
  };

  const generateSkillSuggestions = async () => {
    if (!apiKey) {
      toast.error("Please enter your GROQ API key to use AI features");
      return;
    }

    if (skills.length < 2) {
      toast.warning("Please add at least 2 skills first");
      return;
    }

    try {
      setIsGenerating(true);
      const skillNames = skills.map((skill) => skill.name);
      const suggestions = await enhanceSkills(skillNames, apiKey);
      setSuggestedSkills(
        suggestions.filter(
          (suggestion) =>
            !skillNames.some(
              (name) =>
                name.toLowerCase() === suggestion.toLowerCase() ||
                suggestion.toLowerCase().includes(name.toLowerCase())
            )
        )
      );
      toast.success("Skill suggestions generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate suggestions. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="resume-section">
      <h2 className="text-xl font-bold text-resume-primary mb-4">Skills</h2>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="skill" className="input-label">
              Add Skill
            </Label>
            <div className="flex gap-2">
              <Input
                id="skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. JavaScript, Project Management"
              />
              <Button onClick={addSkill} disabled={!skillInput.trim()}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mb-6">
          <Label className="input-label">Your Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-1 bg-resume-secondary/10"
              >
                {skill.name}
                <X
                  size={14}
                  className="cursor-pointer ml-1"
                  onClick={() => removeSkill(skill.id)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {skills.length >= 2 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="input-label">AI Skill Suggestions</Label>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={generateSkillSuggestions}
              disabled={isGenerating}
            >
              <Sparkles size={14} />
              {isGenerating ? "Generating..." : "Get Suggestions"}
            </Button>
          </div>

          {suggestedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1.5 text-sm cursor-pointer hover:bg-resume-primary hover:text-white transition-colors"
                  onClick={() => addSuggestedSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {skills.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No skills added yet</p>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
