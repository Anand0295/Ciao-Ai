# Ciao AI 👋

Native AI-powered code review assistant that works locally with your git workflow.

## Features

🚀 **Native Git Integration** - Works with git hooks, no webhooks needed
🔒 **Privacy First** - Code stays on your machine
⚡ **Instant Feedback** - Real-time analysis as you code
🧠 **AI-Powered** - Smart suggestions using GPT-4
🛡️ **Security Focused** - Detects vulnerabilities and secrets
📊 **Quality Scoring** - Get objective code quality metrics

## Quick Start

```bash
# Install dependencies
npm install

# Install git hooks
npm run start install

# Review your changes
npm run start review
```

## Usage

### CLI Commands

```bash
# Review current changes
ciao review

# Review with JSON output
ciao review --format json

# Install git hooks
ciao install
```

### Git Hook Integration

Once installed, Ciao AI automatically reviews your code before each commit:

```bash
git add .
git commit -m "your changes"
# Ciao AI runs automatically and blocks bad commits
```

## Configuration

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key"
```

## Architecture

- **ReviewEngine**: Core orchestration
- **GitAnalyzer**: Native git integration
- **AIReviewer**: GPT-4 powered suggestions
- **CodeAnalyzer**: Static analysis rules
- **Hooks**: Git workflow integration

## License

MIT - Build whatever you want with this!