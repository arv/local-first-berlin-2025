import cliProgress from 'cli-progress';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';

const repo = 'arv/local-first-berlin-2025';
const tag = 'v1';
const filename = 'seed.sql';

const url = `https://github.com/${repo}/releases/download/${tag}/${filename}`;

const localDir = './docker';
const localPath = path.join(localDir, filename);

async function getLocalFileMtime() {
  try {
    const stat = await fsp.stat(localPath);
    return stat.mtime;
  } catch {
    return null;
  }
}

async function getRemoteLastModified() {
  const res = await fetch(url, {method: 'HEAD'});
  if (!res.ok) throw new Error(`HEAD failed: ${res.status}`);
  const lastMod = res.headers.get('last-modified');
  return lastMod ? new Date(lastMod) : null;
}

async function downloadWithProgress() {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);

  const totalBytes = Number(res.headers.get('content-length')) || 0;
  await fsp.mkdir(localDir, {recursive: true});

  const progressBar = new cliProgress.SingleBar(
    {
      format: 'Downloading seed.sql [{bar}] {percentage}% | {value}/{total} MB',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  );

  if (totalBytes) progressBar.start(Math.round(totalBytes / (1024 * 1024)), 0);

  let downloaded = 0;
  const fileStream = fs.createWriteStream(localPath);

  // Clean up on abort
  const cleanup = async () => {
    if (progressBar) progressBar.stop();
    fileStream.close();
    try {
      await fsp.unlink(localPath);
      console.error('\nDownload aborted. Partial file removed.');
    } catch (err) {
      console.error('\nDownload aborted. Failed to remove partial file:', err);
    }
  };

  // Handle process termination
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  const nodeStream = Readable.fromWeb(res.body);

  nodeStream.on('data', (chunk) => {
    downloaded += chunk.length;
    if (totalBytes) progressBar.update(Math.round(downloaded / (1024 * 1024)));
  });

  await pipeline(nodeStream, fileStream);

  if (totalBytes) progressBar.stop();
}

async function main() {
  const [localMtime, remoteMtime] = await Promise.all([
    getLocalFileMtime(),
    getRemoteLastModified(),
  ]);

  if (!remoteMtime) {
    console.warn('Warning: no Last-Modified header; downloading anyway.');
    await downloadWithProgress();
    return;
  }

  if (!localMtime || remoteMtime > localMtime) {
    console.log('Downloading newer seed.sql...');
    await downloadWithProgress();
    console.log('\nSaved to docker/seed.sql');
  } else {
    console.log('Local seed.sql is up to date.');
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
