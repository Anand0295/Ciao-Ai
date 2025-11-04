#!/usr/bin/env node

import { Command } from 'commander';
import { ReviewEngine } from './core/ReviewEngine.js';
import chalk from 'chalk';
import { writeFileSync } from 'fs';

const program = new Command();

program
  .name('ciao')
  .description('Native AI-powered code review assistant')
  .version('1.0.0');

program
  .command('review')
  .description('Review current changes')
  .option('-f, --format <type>', 'output format (json|text)', 'text')
  .action(async (options) => {
    const engine = new ReviewEngine();
    const result = await engine.reviewChanges(process.cwd());

    if (options.format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(chalk.blue('🔍 Ciao AI Review Results\n'));
      console.log(chalk.green(`Score: ${result.score}/100`));
      console.log(chalk.gray(`Summary: ${result.summary}\n`));

      if (result.issues.length > 0) {
        console.log(chalk.red('Issues:'));
        result.issues.forEach(issue => {
          const color = issue.severity === 'error' ? chalk.red : 
                       issue.severity === 'warning' ? chalk.yellow : chalk.blue;
          console.log(color(`  ${issue.file}:${issue.line} - ${issue.message}`));
        });
      }

      if (result.suggestions.length > 0) {
        console.log(chalk.cyan('\nSuggestions:'));
        result.suggestions.forEach(suggestion => {
          console.log(chalk.cyan(`  ${suggestion.file}:${suggestion.line} - ${suggestion.reason}`));
        });
      }
    }
  });

program
  .command('install')
  .description('Install git hooks')
  .action(() => {
    const hookContent = `#!/bin/sh
node src/hooks/pre-commit.js
`;
    writeFileSync('.git/hooks/pre-commit', hookContent, { mode: 0o755 });
    console.log(chalk.green('✅ Git hooks installed!'));
  });

program.parse();