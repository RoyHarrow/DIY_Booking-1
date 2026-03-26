#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variable to the correct working directory
process.env.PWD = path.resolve(__dirname);
process.chdir(__dirname);

// Start Next.js in the current process
const next = spawn('node', ['node_modules/next/dist/bin/next', 'dev'], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
});

next.on('close', (code) => {
  process.exit(code);
});
