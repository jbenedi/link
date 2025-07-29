const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

(async () => {
  try {
    const token = core.getInput('token');
    const octokit = new Octokit({ auth: token });
    const { owner, repo } = github.context.repo;
    const issueNumber = github.context.payload.issue.number;

    // Shorten: base64 encode (issueNumber + 10)
    const encoded = Buffer.from((issueNumber + 10).toString()).toString('base64').replace(/=+$/, '');
    const shortUrl = `https://jbenedi.work/link/${encoded}`;

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: shortUrl
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
