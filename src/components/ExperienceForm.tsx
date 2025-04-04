
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Experience } from "@/types/resume";
import { Sparkles, Plus, Trash2, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from "uuid";
import { generateJobDescription, enhanceBulletPoints } from "@/services/aiService";
import { toast } from "sonner";

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  apiKey: string;
}

const ExperienceForm = ({
  experiences,
  onChange,
  apiKey,
}: ExperienceFormProps) => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: uuidv4(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              [field]: value,
              ...(field === "current" && value === true
                ? { endDate: "" }
                : {}),
            }
          : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const generateDescription = async (experience: Experience) => {
    if (!apiKey) {
      toast.error("Please enter your GROQ API key to use AI features");
      return;
    }

    if (!experience.title || !experience.company) {
      toast.warning("Please enter job title and company first");
      return;
    }

    try {
      setGeneratingId(experience.id);
      const years = "3-5"; // Default value
      const description = await generateJobDescription(
        experience.title,
        experience.company,
        years,
        apiKey
      );
      updateExperience(experience.id, "description", description);
      toast.success("Job description generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate description. Please check your API key.");
    } finally {
      setGeneratingId(null);
    }
  };

  const enhanceDescription = async (experience: Experience) => {
    if (!apiKey) {
      toast.error("Please enter your GROQ API key to use AI features");
      return;
    }

    if (!experience.description.trim()) {
      toast.warning("Please enter a description to enhance");
      return;
    }

    try {
      setEnhancingId(experience.id);
      const enhancedDescription = await enhanceBulletPoints(
        experience.description,
        experience.title || "Professional",
        apiKey
      );
      updateExperience(experience.id, "description", enhancedDescription);
      toast.success("Description enhanced with bullet points!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to enhance description. Please check your API key.");
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <div className="resume-section">
      <h2 className="text-xl font-bold text-resume-primary mb-4">Experience</h2>

      {experiences.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <Button onClick={addExperience}>
            <Plus size={16} className="mr-2" /> Add Experience
          </Button>
        </div>
      ) : (
        <>
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className={`border rounded-lg p-4 mb-4 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Position {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-8 w-8"
                  onClick={() => removeExperience(experience.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="input-label">Job Title</Label>
                  <Input
                    value={experience.title}
                    onChange={(e) =>
                      updateExperience(experience.id, "title", e.target.value)
                    }
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <Label className="input-label">Company</Label>
                  <Input
                    value={experience.company}
                    onChange={(e) =>
                      updateExperience(experience.id, "company", e.target.value)
                    }
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="input-label">Location</Label>
                  <Input
                    value={experience.location}
                    onChange={(e) =>
                      updateExperience(experience.id, "location", e.target.value)
                    }
                    placeholder="New York, NY"
                  />
                </div>

                <div className="flex items-center h-full pt-5">
                  <Switch
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onCheckedChange={(checked) =>
                      updateExperience(experience.id, "current", checked)
                    }
                  />
                  <Label
                    htmlFor={`current-${experience.id}`}
                    className="ml-2 text-sm"
                  >
                    I currently work here
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="input-label">Start Date</Label>
                  <Input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) =>
                      updateExperience(
                        experience.id,
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label className="input-label">End Date</Label>
                  <Input
                    type="month"
                    value={experience.endDate}
                    onChange={(e) =>
                      updateExperience(experience.id, "endDate", e.target.value)
                    }
                    disabled={experience.current}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="input-label">Description</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => enhanceDescription(experience)}
                      disabled={enhancingId === experience.id}
                    >
                      <Zap size={14} />
                      {enhancingId === experience.id
                        ? "Enhancing..."
                        : "Enhance Bullets"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => generateDescription(experience)}
                      disabled={generatingId === experience.id}
                    >
                      <Sparkles size={14} />
                      {generatingId === experience.id
                        ? "Generating..."
                        : "Generate with AI"}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={experience.description}
                  onChange={(e) =>
                    updateExperience(
                      experience.id,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe your responsibilities and achievements"
                  className="h-24"
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addExperience}
            className="w-full mt-2"
          >
            <Plus size={16} className="mr-2" /> Add Another Position
          </Button>
        </>
      )}
    </div>
  );
};

export default ExperienceForm;
