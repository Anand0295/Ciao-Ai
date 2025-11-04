export class CodeAnalyzer {
  async analyze(changes) {
    const issues = [];

    for (const change of changes) {
      const fileIssues = await this.analyzeFile(change);
      issues.push(...fileIssues);
    }

    return issues;
  }

  async analyzeFile(change) {
    const issues = [];
    const lines = change.content.split('\n');

    lines.forEach((line, index) => {
      issues.push(...this.checkSecurity(line, index + 1, change.path));
      issues.push(...this.checkComplexity(line, index + 1, change.path));
      issues.push(...this.checkStyle(line, index + 1, change.path));
    });

    return issues;
  }

  checkSecurity(line, lineNum, file) {
    const issues = [];

    // SQL Injection
    if (line.includes('SELECT') && line.includes('+')) {
      issues.push({
        file,
        line: lineNum,
        severity: 'error',
        message: 'Potential SQL injection vulnerability',
        rule: 'security/sql-injection'
      });
    }

    // Hardcoded secrets
    if (/(?:password|secret|key|token)\s*[:=]\s*['"][^'"]+['"]/.test(line)) {
      issues.push({
        file,
        line: lineNum,
        severity: 'error',
        message: 'Hardcoded secret detected',
        rule: 'security/hardcoded-secret'
      });
    }

    return issues;
  }

  checkComplexity(line, lineNum, file) {
    const issues = [];

    // Long lines
    if (line.length > 120) {
      issues.push({
        file,
        line: lineNum,
        severity: 'warning',
        message: 'Line too long (>120 characters)',
        rule: 'style/line-length'
      });
    }

    // Deep nesting
    const indentLevel = (line.match(/^\s*/)?.[0].length || 0) / 2;
    if (indentLevel > 4) {
      issues.push({
        file,
        line: lineNum,
        severity: 'warning',
        message: 'Deep nesting detected (>4 levels)',
        rule: 'complexity/nesting'
      });
    }

    return issues;
  }

  checkStyle(line, lineNum, file) {
    const issues = [];

    // Console.log in production
    if (line.includes('console.log') && !line.includes('//')) {
      issues.push({
        file,
        line: lineNum,
        severity: 'info',
        message: 'Remove console.log before production',
        rule: 'style/no-console'
      });
    }

    return issues;
  }
}