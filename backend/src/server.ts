import Fastify from 'fastify';
import cors from '@fastify/cors';
import { analyze } from './analyzer.js';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get('/api/health', async () => ({ status: 'ok', service: 'codeshield' }));
app.post<{ Body: { files?: Record<string, string> } }>('/api/analyze', async (request, reply) => {
  const files = request.body?.files;
  if (!files || typeof files !== 'object' || Array.isArray(files)) return reply.code(400).send({ error: 'files must be an object mapping filenames to source text' });
  if (Object.keys(files).length > 50) return reply.code(413).send({ error: 'maximum 50 files per analysis' });
  return analyze(files);
});

await app.listen({ port: Number(process.env.PORT ?? 4000), host: '0.0.0.0' });
