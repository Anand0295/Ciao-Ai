import { GitAnalyzer } from './GitAnalyzer.js';
import { AIReviewer } from '../ai/AIReviewer.js';
import { CodeAnalyzer } from '../analyzers/CodeAnalyzer.js';

export class ReviewEngine {
  constructor() {
    this.gitAnalyzer = new GitAnalyzer();
    this.aiReviewer = new AIReviewer();
    this.codeAnalyzer = new CodeAnalyzer();
  }

  async reviewChanges(repoPath) {
    const changes = await this.gitAnalyzer.getChangedFiles(repoPath);
    const staticIssues = await this.codeAnalyzer.analyze(changes);
    const aiSuggestions = await this.aiReviewer.review(changes);

    return {
      issues: staticIssues,
      suggestions: aiSuggestions,
      score: this.calculateScore(staticIssues),
      summary: this.generateSummary(staticIssues, aiSuggestions)
    };
  }

  calculateScore(issues) {
    const weights = { error: 10, warning: 5, info: 1 };
    const totalDeductions = issues.reduce((sum, issue) => sum + weights[issue.severity], 0);
    return Math.max(0, 100 - totalDeductions);
  }

  generateSummary(issues, suggestions) {
    return `Found ${issues.length} issues and ${suggestions.length} suggestions`;
  }
}