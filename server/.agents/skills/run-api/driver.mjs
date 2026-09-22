#!/usr/bin/env node
import { spawn } from 'child_process';
import http from 'http';

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

async function waitForPort(port, host = 'localhost', timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const req = http.request(
        {
          host,
          port,
          path: '/api/v1/health',
          method: 'GET',
          timeout: 2000,
        },
        (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            // Try again
            setTimeout(check, 500);
          }
        }
      );
      req.on('error', (err) => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Timeout waiting for ${host}:${port} to be ready`));
        } else {
          setTimeout(check, 500);
        }
      });
      req.end();
    };
    check();
  });
}

async function main() {
  try {
    console.log('🔨 Building the API...');
    await runCommand('npm', ['run', 'build'], { cwd: process.cwd() });

    console.log('🚀 Starting the server...');
    const server = spawn('npm', ['run', 'start:prod'], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Log server output
    server.stdout.on('data', (data) => {
      process.stdout.write(`[server] ${data}`);
    });
    server.stderr.on('data', (data) => {
      process.stderr.write(`[server] ${data}`);
    });

    // Wait for the server to be ready on port 3001 (or from env)
    const port = process.env.API_PORT || 3001;
    console.log(`⏳ Waiting for server on port ${port}...`);
    await waitForPort(port, 'localhost', 15000);

    console.log('✅ Server is ready! Running smoke test...');
    // Make a request to the health endpoint
    const response = await new Promise((resolve, reject) => {
      http.get(
        {
          host: 'localhost',
          port: port,
          path: '/api/v1/health',
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, data });
          });
        }
      ).on('error', reject);
    });

    console.log(`🩺 Health check: ${response.statusCode}`);
    console.log(`📄 Response: ${response.data}`);

    if (response.statusCode !== 200) {
      throw new Error(`Health check failed with status ${response.statusCode}`);
    }

    console.log('🎉 Smoke test passed!');

    // Kill the server and wait for it to exit
    server.kill();
    await new Promise((resolve) => server.once('close', resolve));
    console.log('🛑 Server stopped');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();