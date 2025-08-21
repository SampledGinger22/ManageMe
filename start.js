import { spawn } from 'child_process';
import { platform } from 'os';

console.log('Starting ManageMe...');

// Determine the shell command based on platform
const isWindows = platform() === 'win32';
const shell = isWindows ? 'cmd.exe' : 'sh';
const shellArg = isWindows ? '/c' : '-c';

// Start backend server
const backend = spawn(shell, [shellArg, 'npx tsx server/index.ts'], {
  stdio: 'inherit',
  shell: true
});

// Give backend a moment to start, then start frontend
setTimeout(() => {
  const frontend = spawn(shell, [shellArg, 'vite'], {
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    backend.kill();
    frontend.kill();
    process.exit();
  });

  frontend.on('exit', (code) => {
    backend.kill();
    process.exit(code);
  });

  backend.on('exit', (code) => {
    frontend.kill();
    process.exit(code);
  });
}, 2000);