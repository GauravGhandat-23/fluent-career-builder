
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfo } from "@/types/resume";
import { Sparkles } from "lucide-react";
import { generateSummary } from "@/services/aiService";
import { toast } from "sonner";

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onChange: (info: PersonalInfo) => void;
  apiKey: string;
}

const PersonalInfoForm = ({
  personalInfo,
  onChange,
  apiKey,
}: PersonalInfoFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...personalInfo, [name]: value });
  };

  const generateAISummary = async () => {
    if (!apiKey) {
      toast.error("Please enter your GROQ API key to use AI features");
      return;
    }

    if (!personalInfo.fullName || !personalInfo.title) {
      toast.warning("Please enter your name and job title first");
      return;
    }

    try {
      setIsGenerating(true);
      const summary = await generateSummary(
        personalInfo.fullName,
        personalInfo.title,
        "5 years",
        ["Communication", "Leadership", "Problem Solving"],
        apiKey
      );
      onChange({ ...personalInfo, summary });
      toast.success("Professional summary generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="resume-section">
      <h2 className="text-xl font-bold text-resume-primary mb-4">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="fullName" className="input-label">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label htmlFor="title" className="input-label">
            Job Title
          </Label>
          <Input
            id="title"
            name="title"
            value={personalInfo.title}
            onChange={handleChange}
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="email" className="input-label">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={personalInfo.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="input-label">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="location" className="input-label">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={personalInfo.location}
            onChange={handleChange}
            placeholder="New York, NY"
          />
        </div>

        <div>
          <Label htmlFor="linkedin" className="input-label">
            LinkedIn (optional)
          </Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin || ""}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="website" className="input-label">
          Website (optional)
        </Label>
        <Input
          id="website"
          name="website"
          value={personalInfo.website || ""}
          onChange={handleChange}
          placeholder="johndoe.com"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="summary" className="input-label">
            Professional Summary
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex items-center gap-1 text-xs"
            onClick={generateAISummary}
            disabled={isGenerating}
          >
            <Sparkles size={14} />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
        <Textarea
          id="summary"
          name="summary"
          value={personalInfo.summary}
          onChange={handleChange}
          placeholder="A brief summary highlighting your professional background and expertise"
          className="h-24"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
