
import { ResumeData } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  const { personalInfo, experiences, education, skills } = resumeData;

  return (
    <div className="resume-preview animate-fade-in">
      <div className="border-b-2 border-resume-primary pb-4">
        <h1 className="text-2xl font-bold text-resume-primary">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <h2 className="text-lg text-resume-secondary font-medium mt-1">
          {personalInfo.title || "Your Job Title"}
        </h2>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          {personalInfo.website && <div>{personalInfo.website}</div>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mt-4">
          <h3 className="text-md font-bold text-resume-primary mb-2">Summary</h3>
          <p className="text-sm">{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-bold text-resume-primary mb-2">
            Professional Experience
          </h3>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-semibold">
                  {exp.title || "Position Title"} |{" "}
                  <span className="font-normal">{exp.company || "Company"}</span>
                </h4>
                <div className="text-sm text-gray-600">
                  {exp.startDate &&
                    `${formatDate(exp.startDate)} - ${
                      exp.current ? "Present" : formatDate(exp.endDate)
                    }`}
                </div>
              </div>
              {exp.location && (
                <div className="text-sm text-gray-600">{exp.location}</div>
              )}
              {exp.description && (
                <div
                  className="text-sm mt-1"
                  dangerouslySetInnerHTML={{
                    __html: exp.description.replace(/\n/g, "<br />"),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-bold text-resume-primary mb-2">
            Education
          </h3>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-semibold">
                  {edu.degree || "Degree"}{" "}
                  {edu.field && `in ${edu.field}`} |{" "}
                  <span className="font-normal">
                    {edu.institution || "Institution"}
                  </span>
                </h4>
                <div className="text-sm text-gray-600">
                  {edu.startDate &&
                    `${formatDate(edu.startDate)} - ${formatDate(
                      edu.endDate
                    )}`}
                </div>
              </div>
              <div className="flex justify-between">
                {edu.location && (
                  <div className="text-sm text-gray-600">{edu.location}</div>
                )}
                {edu.gpa && (
                  <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-bold text-resume-primary mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="text-sm bg-resume-secondary/10 px-2 py-1 rounded"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
