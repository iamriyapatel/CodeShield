export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ skipped: true, reason: 'OPENROUTER_API_KEY is not configured' });
  const body = await request.json().catch(() => null) as { findings?: unknown } | null;
  if (!body?.findings) return Response.json({ error: 'findings are required' }, { status: 400 });
  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': process.env.APP_URL ?? 'https://codeshield.vercel.app', 'X-Title': 'CodeShield' }, body: JSON.stringify({ model: process.env.OPENROUTER_MODEL ?? 'thinkingmachines/inkling:free', temperature: 0.2, messages: [{ role: 'system', content: 'You are a defensive application-security reviewer. For each finding, explain the root cause (RCA), impact, and provide a concrete safe fix. Do not claim certainty beyond the evidence. Return concise Markdown.' }, { role: 'user', content: JSON.stringify(body.findings) }] }) });
  const data = await upstream.json();
  return Response.json(data, { status: upstream.status });
}
