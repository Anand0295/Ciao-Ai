import simpleGit from 'simple-git';
import { readFileSync } from 'fs';

export class GitAnalyzer {
  constructor(repoPath) {
    this.git = simpleGit(repoPath);
  }

  async getChangedFiles(repoPath) {
    const status = await this.git.status();
    const changes = [];

    for (const file of [...status.modified, ...status.created]) {
      try {
        const content = readFileSync(`${repoPath}/${file}`, 'utf-8');
        const diff = await this.git.diff(['HEAD', file]);
        
        changes.push({
          path: file,
          content,
          diff,
          status: status.created.includes(file) ? 'added' : 'modified'
        });
      } catch (error) {
        console.warn(`Could not read file: ${file}`);
      }
    }

    return changes;
  }

  async getStagedFiles(repoPath) {
    const diff = await this.git.diff(['--cached', '--name-status']);
    const changes = [];

    for (const line of diff.split('\n').filter(Boolean)) {
      const [status, path] = line.split('\t');
      if (!path) continue;

      try {
        const content = readFileSync(`${repoPath}/${path}`, 'utf-8');
        const fileDiff = await this.git.diff(['--cached', path]);
        
        changes.push({
          path,
          content,
          diff: fileDiff,
          status: status === 'A' ? 'added' : 'modified'
        });
      } catch (error) {
        console.warn(`Could not read staged file: ${path}`);
      }
    }

    return changes;
  }
}