import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { Client } from 'basic-ftp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.deploy.local');

function loadDeployEnv() {
  if (!existsSync(envPath)) {
    console.error('Falta .env.deploy.local (copia desde .env.deploy.example)');
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const indexOfEquals = trimmed.indexOf('=');
    if (indexOfEquals === -1) continue;
    env[trimmed.slice(0, indexOfEquals).trim()] = trimmed.slice(indexOfEquals + 1).trim();
  }
  return env;
}

function runBuild(deployConfig) {
  return new Promise((resolvePromise, reject) => {
    const environment = { ...process.env };
    if (deployConfig.VITE_BASE_PATH) {
      environment.VITE_BASE_PATH = deployConfig.VITE_BASE_PATH;
    }

    const child = spawn('npm', ['run', 'build'], {
      cwd: root,
      env: environment,
      stdio: 'inherit',
      shell: true,
    });
    child.on('close', (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`build falló (${code})`)),
    );
  });
}

async function deployFtp(deployConfig) {
  const ftpClient = new Client(60_000);
  ftpClient.ftp.verbose = process.env.FTP_VERBOSE === '1';

  const port = Number(deployConfig.FTP_PORT || 21);
  const secure = deployConfig.FTP_SECURE === 'true';

  await ftpClient.access({
    host: deployConfig.FTP_HOST,
    user: deployConfig.FTP_USER,
    password: deployConfig.FTP_PASSWORD,
    port,
    secure,
  });

  const remoteDir = (deployConfig.FTP_REMOTE_DIR || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');
  const distPath = resolve(root, 'dist');

  await ftpClient.cd('/');
  console.log(`Subiendo ${distPath} → /${remoteDir || ''}…`);
  await ftpClient.uploadFromDir(distPath, remoteDir || undefined);
  ftpClient.close();
}

const deployConfig = loadDeployEnv();
const requiredKeys = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
for (const requiredKey of requiredKeys) {
  if (!deployConfig[requiredKey]) {
    console.error(`Falta ${requiredKey} en .env.deploy.local`);
    process.exit(1);
  }
}

console.log('Build de producción…');
if (deployConfig.VITE_BASE_PATH) {
  console.log(`  VITE_BASE_PATH=${deployConfig.VITE_BASE_PATH}`);
}

await runBuild(deployConfig);
await deployFtp(deployConfig);
console.log('Despliegue FTP completado.');
