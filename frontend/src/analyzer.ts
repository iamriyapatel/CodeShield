import type { AnalysisResult, Confidence, Finding, Severity } from './types';

type Rule = { id: string; title: string; pattern: RegExp; severity: Severity; confidence: Confidence; description: string; remediation: string };

const rules: Rule[] = [
  { id: 'CS001', title: 'Potential hardcoded secret', pattern: /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{8,}['"]/i, severity: 'High', confidence: 'Medium', description: 'A credential-like value appears to be assigned directly in source code.', remediation: 'Move secrets to a managed environment variable or secret store and rotate exposed credentials.' },
  { id: 'CS002', title: 'Dynamic code execution', pattern: /\beval\s*\(/, severity: 'High', confidence: 'High', description: 'eval executes strings as code and can turn attacker-controlled input into code execution.', remediation: 'Avoid eval and use explicit, constrained parsing or dispatch logic.' },
  { id: 'CS003', title: 'Potential command injection', pattern: /child_process\.(exec|execSync)\s*\(/, severity: 'Critical', confidence: 'Medium', description: 'Shell commands may be constructed with untrusted input.', remediation: 'Prefer execFile with fixed arguments and validate every user-controlled value.' },
  { id: 'CS004', title: 'Potential SQL injection', pattern: /(SELECT|INSERT|UPDATE|DELETE)[^;`]*\+\s*[A-Za-z_$]/i, severity: 'High', confidence: 'Medium', description: 'A SQL statement appears to be assembled through string concatenation.', remediation: 'Use parameterized queries or the database client’s safe query builder.' },
  { id: 'CS005', title: 'Unsafe HTML rendering', pattern: /dangerouslySetInnerHTML\s*=|\.innerHTML\s*=/, severity: 'High', confidence: 'Medium', description: 'Raw HTML is inserted into a document and may enable cross-site scripting.', remediation: 'Render trusted structured data or sanitize HTML with a well-maintained allowlist sanitizer.' }
];

export function analyze(files: Record<string, string>): AnalysisResult {
  const findings: Finding[] = [];
  for (const [file, source] of Object.entries(files)) {
    source.split(/\r?\n/).forEach((lineText, index) => rules.forEach(rule => {
      if (rule.pattern.test(lineText)) findings.push({ id: `${rule.id}-${file}-${index + 1}`, ruleId: rule.id, title: rule.title, description: rule.description, severity: rule.severity, confidence: rule.confidence, file, line: index + 1, evidence: lineText.trim().slice(0, 240), remediation: rule.remediation });
    }));
  }
  return { posture: findings.some(f => f.severity === 'Critical') ? 'Critical' : findings.length ? 'Needs attention' : 'Good', filesAnalyzed: Object.keys(files).length, findings };
}
