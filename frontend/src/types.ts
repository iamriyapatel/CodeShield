export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
export type Confidence = 'High' | 'Medium' | 'Low';
export interface Finding { id: string; ruleId: string; title: string; description: string; severity: Severity; confidence: Confidence; file: string; line: number; evidence: string; remediation: string; }
export interface AnalysisResult { posture: 'Good' | 'Needs attention' | 'Critical'; filesAnalyzed: number; findings: Finding[]; }
