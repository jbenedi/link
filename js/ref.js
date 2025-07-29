const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

(async () => {
  try {
    const token = process.env.INPUT_TOKEN;
    const octokit = new Octokit({ auth: token });

    const { owner, repo } = github.context.repo;
    const issueNumber = github.context.payload.issue.number;

    function encodeIssueId(id) {
      return Buffer.from(String(id)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    const shortCode = encodeIssueId(issueNumber + 10);
    const shortUrl = `https://jbenedi.work/link/${shortCode}`;

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
