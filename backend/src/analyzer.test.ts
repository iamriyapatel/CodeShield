import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from './analyzer.js';

test('detects multiple security indicators with locations', () => {
  const result = analyze({ 'auth.ts': "const password = 'super-secret-value';\neval(input);" });
  assert.equal(result.filesAnalyzed, 1);
  assert.equal(result.findings.length, 2);
  assert.equal(result.findings[0].file, 'auth.ts');
  assert.equal(result.findings[1].line, 2);
});

test('reports clean code as good', () => {
  assert.equal(analyze({ 'safe.ts': 'const answer = 42;' }).posture, 'Good');
});
