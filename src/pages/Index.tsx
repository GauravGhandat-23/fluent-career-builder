
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import ExperienceForm from "@/components/ExperienceForm";
import EducationForm from "@/components/EducationForm";
import SkillsForm from "@/components/SkillsForm";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeData } from "@/types/resume";
import { defaultResumeData, exportToPDF } from "@/lib/utils";
import { Download, FileText } from "lucide-react";
import ApiKeyForm from "@/components/ApiKeyForm";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [apiKey, setApiKey] = useState("");

  // Load resume data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved resume data:", e);
      }
    }

    const savedApiKey = localStorage.getItem("groqApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save resume data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("groqApiKey", apiKey);
  }, [apiKey]);

  const updatePersonalInfo = (personalInfo: ResumeData["personalInfo"]) => {
    setResumeData((prev) => ({ ...prev, personalInfo }));
  };

  const updateExperiences = (experiences: ResumeData["experiences"]) => {
    setResumeData((prev) => ({ ...prev, experiences }));
  };

  const updateEducation = (education: ResumeData["education"]) => {
    setResumeData((prev) => ({ ...prev, education }));
  };

  const updateSkills = (skills: ResumeData["skills"]) => {
    setResumeData((prev) => ({ ...prev, skills }));
  };

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await exportToPDF(
        "resume-preview",
        `${resumeData.personalInfo.fullName || "resume"}`
          .toLowerCase()
          .replace(/\s+/g, "_")
      );
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-resume-light flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-resume-primary">
              Build Your Resume
            </h1>
            <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="personal-info">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-info" className="mt-4">
                  <PersonalInfoForm
                    personalInfo={resumeData.personalInfo}
                    onChange={updatePersonalInfo}
                    apiKey={apiKey}
                  />
                </TabsContent>

                <TabsContent value="experience" className="mt-4">
                  <ExperienceForm
                    experiences={resumeData.experiences}
                    onChange={updateExperiences}
                    apiKey={apiKey}
                  />
                </TabsContent>

                <TabsContent value="education" className="mt-4">
                  <EducationForm
                    education={resumeData.education}
                    onChange={updateEducation}
                  />
                </TabsContent>

                <TabsContent value="skills" className="mt-4">
                  <SkillsForm
                    skills={resumeData.skills}
                    onChange={updateSkills}
                    apiKey={apiKey}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex mt-6 space-x-2 lg:hidden">
                <Button
                  onClick={handleExportPDF}
                  className="bg-resume-primary hover:bg-resume-secondary flex items-center gap-2"
                  disabled={isGeneratingPDF}
                >
                  <Download size={16} />
                  {isGeneratingPDF ? "Generating..." : "Export as PDF"}
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-resume-primary flex items-center gap-2">
                    <FileText size={20} />
                    Preview
                  </h2>
                  <Button
                    onClick={handleExportPDF}
                    className="bg-resume-primary hover:bg-resume-secondary flex items-center gap-2"
                    disabled={isGeneratingPDF}
                  >
                    <Download size={16} />
                    {isGeneratingPDF ? "Generating..." : "Export as PDF"}
                  </Button>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-lg">
                  <div id="resume-preview" className="overflow-hidden">
                    <ResumePreview resumeData={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
