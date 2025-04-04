
import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Check, AlertCircle } from "lucide-react";
import { analyzeGrammarAndATS, scoreResume, ResumeAnalysisResult } from "@/services/resumeAnalysisService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface ResumeAnalysisProps {
  resumeData: ResumeData;
  apiKey: string;
}

const ResumeAnalysis = ({ resumeData, apiKey }: ResumeAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("grammar-ats");
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyzeResume = async () => {
    if (!apiKey) {
      toast.error("Please enter your GROQ API key to use AI features");
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Run both analyses in parallel
      const [grammarAndATS, scoring] = await Promise.all([
        analyzeGrammarAndATS(resumeData, apiKey),
        scoreResume(resumeData, apiKey)
      ]);
      
      setAnalysisResult({
        grammar: grammarAndATS.grammar,
        ats: grammarAndATS.ats,
        scoring
      });
      
      toast.success("Resume analysis complete!");
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast.error("Failed to analyze resume. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderScoreBar = (score: number, label: string) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold">{score}/10</span>
      </div>
      <Progress value={score * 10} className="h-2" />
    </div>
  );

  return (
    <div className="resume-analysis">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-resume-primary">Resume Analysis & Feedback</h2>
        <Button
          onClick={handleAnalyzeResume}
          className="bg-resume-primary hover:bg-resume-secondary flex items-center gap-2"
          disabled={isAnalyzing}
        >
          <Sparkles size={16} />
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </div>

      {!analysisResult ? (
        <div className="p-8 text-center text-gray-500">
          <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">Click "Analyze Resume" to get insights and feedback on your resume</p>
          <p className="text-sm mt-2">We'll check grammar, ATS optimization, and provide overall scoring</p>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="grammar-ats">Grammar & ATS</TabsTrigger>
            <TabsTrigger value="scoring">Resume Scoring</TabsTrigger>
          </TabsList>

          <TabsContent value="grammar-ats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Grammar Check</h3>
                    <Badge variant={analysisResult.grammar.score >= 8 ? "default" : "outline"}>
                      Score: {analysisResult.grammar.score}/10
                    </Badge>
                  </div>

                  {analysisResult.grammar.issues.length > 0 ? (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Issues Found:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {analysisResult.grammar.issues.map((issue, index) => (
                          <li key={index} className="text-amber-600">{issue}</li>
                        ))}
                      </ul>

                      <h4 className="font-semibold mb-2 mt-4 text-sm">Suggestions:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {analysisResult.grammar.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-emerald-600">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertTitle>No grammar issues found</AlertTitle>
                      <AlertDescription>
                        Your resume has excellent grammar!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">ATS Optimization</h3>
                    <Badge variant={analysisResult.ats.score >= 8 ? "default" : "outline"}>
                      Score: {analysisResult.ats.score}/10
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Optimization Tips:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {analysisResult.ats.optimization.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>

                    <h4 className="font-semibold mb-2 mt-4 text-sm">Suggested Keywords:</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {analysisResult.ats.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-resume-secondary/10">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scoring">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Resume Score</h3>
                    <p className="text-sm text-gray-500">Overall assessment of your resume</p>
                  </div>
                  <Badge
                    className="text-lg py-1 px-3"
                    variant={analysisResult.scoring.overall >= 8 ? "default" : "outline"}
                  >
                    {analysisResult.scoring.overall}/10
                  </Badge>
                </div>

                <Separator className="my-4" />

                {renderScoreBar(analysisResult.scoring.clarity, "Clarity")}
                {renderScoreBar(analysisResult.scoring.impact, "Impact")}
                {renderScoreBar(analysisResult.scoring.relevance, "Relevance")}

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Detailed Feedback:</h4>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {analysisResult.scoring.feedback}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ResumeAnalysis;
