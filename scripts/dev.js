const net = require('node:net');
const { spawn } = require('node:child_process');
const path = require('node:path');

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') resolve(false);
      else reject(error);
    });
    server.once('listening', () => server.close(() => resolve(true)));
    // Nest/Express listens on the dual-stack IPv6 wildcard by default; probe
    // the same address so an IPv6-only listener is not mistaken as free.
    server.listen(port, '::');
  });
}

async function findAvailablePort(startPort = Number(process.env.PORT) || 3000) {
  for (let port = startPort; port < startPort + 100; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available development port found between ${startPort} and ${startPort + 99}.`);
}

async function main() {
  const port = await findAvailablePort();
  const cli = path.resolve(__dirname, '../node_modules/@nestjs/cli/bin/nest.js');
  console.log(`Starting Adams development server at http://localhost:${port}`);

  const child = spawn(process.execPath, [cli, 'start', '--watch'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  });

  child.on('error', (error) => {
    console.error('Could not start the NestJS development server:', error.message);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exitCode = code ?? 1;
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
