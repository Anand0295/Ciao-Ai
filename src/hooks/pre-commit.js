#!/usr/bin/env node

import { ReviewEngine } from '../core/ReviewEngine.js';
import chalk from 'chalk';

async function preCommitHook() {
  console.log(chalk.blue('🔍 Ciao AI reviewing your changes...'));
  
  const engine = new ReviewEngine();
  const result = await engine.reviewChanges(process.cwd());

  const errors = result.issues.filter(i => i.severity === 'error');
  const warnings = result.issues.filter(i => i.severity === 'warning');

  if (errors.length > 0) {
    console.log(chalk.red('\n❌ Blocking issues found:'));
    errors.forEach(issue => {
      console.log(chalk.red(`  ${issue.file}:${issue.line} - ${issue.message}`));
    });
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  Warnings:'));
    warnings.forEach(issue => {
      console.log(chalk.yellow(`  ${issue.file}:${issue.line} - ${issue.message}`));
    });
  }

  if (result.suggestions.length > 0) {
    console.log(chalk.cyan('\n💡 AI Suggestions:'));
    result.suggestions.slice(0, 3).forEach(suggestion => {
      console.log(chalk.cyan(`  ${suggestion.file}:${suggestion.line} - ${suggestion.reason}`));
    });
  }

  console.log(chalk.green(`\n✅ Code quality score: ${result.score}/100`));
  console.log(chalk.blue('🎉 Ready to commit!'));
}

preCommitHook().catch(console.error);