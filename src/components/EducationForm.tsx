
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const EducationForm = ({ education, onChange }: EducationFormProps) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      location: "",
      gpa: "",
    };
    onChange([...education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  return (
    <div className="resume-section">
      <h2 className="text-xl font-bold text-resume-primary mb-4">Education</h2>

      {education.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No education added yet</p>
          <Button onClick={addEducation}>
            <Plus size={16} className="mr-2" /> Add Education
          </Button>
        </div>
      ) : (
        <>
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className={`border rounded-lg p-4 mb-4 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Education {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 h-8 w-8"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="input-label">Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, "institution", e.target.value)
                    }
                    placeholder="University of California"
                  />
                </div>

                <div>
                  <Label className="input-label">Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(edu.id, "location", e.target.value)
                    }
                    placeholder="Berkeley, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="input-label">Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    placeholder="Bachelor of Science"
                  />
                </div>

                <div>
                  <Label className="input-label">Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, "field", e.target.value)
                    }
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="input-label">Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "startDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label className="input-label">End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "endDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label className="input-label">GPA (optional)</Label>
                  <Input
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, "gpa", e.target.value)
                    }
                    placeholder="3.8"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addEducation}
            className="w-full mt-2"
          >
            <Plus size={16} className="mr-2" /> Add Another Education
          </Button>
        </>
      )}
    </div>
  );
};

export default EducationForm;
