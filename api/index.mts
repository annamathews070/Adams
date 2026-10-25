import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const publicDirectory = join(process.cwd(), 'public');
const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const requestedFile = normalize(join(publicDirectory, requestPath));
    const isInsidePublic = requestedFile === publicDirectory || requestedFile.startsWith(`${publicDirectory}/`);
    const filePath = isInsidePublic && (await stat(requestedFile).catch(() => null))?.isFile()
      ? requestedFile
      : join(publicDirectory, 'index.html');
    const body = await readFile(filePath);

    response.statusCode = 200;
    response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
    response.setHeader('Cache-Control', filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable');
    if (request.method !== 'HEAD') response.end(body);
    else response.end();
  } catch {
    response.statusCode = 500;
    response.end('Unable to load the site.');
  }
}