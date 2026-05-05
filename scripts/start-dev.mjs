import { spawn } from 'node:child_process';

const processes = [];

const spawnProcess = (name, command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (signal || code !== 0) {
      shutdown(signal || `exit ${code}`);
      process.exit(code ?? 1);
    }
  });

  processes.push({ name, child });
  return child;
};

const shutdown = (reason) => {
  for (const { child } of processes) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }

  if (reason) {
    console.log(`Shutting down dev processes: ${reason}`);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

spawnProcess('server', 'npm', ['run', 'dev', '--prefix', 'server'], process.cwd());
spawnProcess('client', 'npm', ['run', 'dev', '--', '--host', '0.0.0.0'], process.cwd());