import OpenAI from 'openai';

export class AIReviewer {
  constructor() {
    this.hasApiKey = !!process.env.OPENAI_API_KEY;
    if (this.hasApiKey) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async review(changes) {
    if (!this.hasApiKey) {
      console.warn('⚠️  OpenAI API key not found. Skipping AI review.');
      return [];
    }

    const suggestions = [];

    for (const change of changes) {
      if (this.shouldSkipFile(change.path)) continue;

      const fileSuggestions = await this.reviewFile(change);
      suggestions.push(...fileSuggestions);
    }

    return suggestions;
  }

  async reviewFile(change) {
    const prompt = this.buildReviewPrompt(change);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are Ciao, an expert code reviewer. Provide specific, actionable suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1
      });

      return this.parseSuggestions(response.choices[0]?.message?.content || '', change.path);
    } catch (error) {
      console.warn(`AI review failed for ${change.path}:`, error);
      return [];
    }
  }

  buildReviewPrompt(change) {
    return `Review this ${change.status} file and suggest improvements:

File: ${change.path}
Content:
\`\`\`
${change.content}
\`\`\`

Diff:
\`\`\`
${change.diff}
\`\`\`

Focus on: security, performance, readability, best practices.
Format: line:original_code -> suggested_code (reason)`;
  }

  parseSuggestions(response, filePath) {
    const suggestions = [];
    const lines = response.split('\n');

    for (const line of lines) {
      const match = line.match(/(\d+):(.+?) -> (.+?) \((.+?)\)/);
      if (match) {
        const [, lineNum, original, suggested, reason] = match;
        suggestions.push({
          file: filePath,
          line: parseInt(lineNum),
          original: original.trim(),
          suggested: suggested.trim(),
          reason: reason.trim()
        });
      }
    }

    return suggestions;
  }

  shouldSkipFile(path) {
    const skipExtensions = ['.lock', '.log', '.tmp'];
    const skipDirs = ['node_modules', '.git', 'dist', 'build'];
    
    return skipExtensions.some(ext => path.endsWith(ext)) ||
           skipDirs.some(dir => path.includes(dir));
  }
}