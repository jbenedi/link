const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

(async () => {
  try {
    const token = process.env.INPUT_TOKEN;
    if (!token) {
      console.error('Missing GitHub token');
      process.exit(1);
    }

    const octokit = new Octokit({ auth: token });
    const context = github.context;

    const issue = context.payload.issue;
    if (!issue || !issue.number) {
      console.error('No issue number found in context');
      process.exit(1);
    }

    const { owner, repo } = context.repo;
    const issueNumber = issue.number;

    const encoded = Buffer.from(String(issueNumber + 10))
      .toString('base64')
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const shortUrl = `https://jbenedi.work/link/${encoded}`;

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: shortUrl,
    });

    console.log(`✅ Shortened link created: ${shortUrl}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
