export interface AnalysisResponse {
  atsScore: number;
  skillGap: {
    matched: string[];
    missing: string[];
  };
  rewriteSuggestions: {
    before: string;
    after: string;
    impact: string;
  }[];
  interviewPrep: {
    question: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  }[];
  rewrittenResume: string;
}
