const { Octokit } = require('@octokit/rest');

const token = process.env.INPUT_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const eventPath = process.env.GITHUB_EVENT_PATH;

(async () => {
  try {
    if (!token || !repo || !eventPath) {
      throw new Error("Missing GitHub token or event context");
    }

    const [owner, repoName] = repo.split("/");
    const event = require(eventPath);

    const issueNumber = event.issue?.number;
    if (!issueNumber) {
      throw new Error("No issue number found in event payload");
    }

    const octokit = new Octokit({ auth: token });

    const shortCode = Buffer.from(String(issueNumber + 10))
      .toString("base64")
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const shortUrl = `https://jbenedi.work/link/${shortCode}`;

    await octokit.issues.createComment({
      owner,
      repo: repoName,
      issue_number: issueNumber,
      body: shortUrl,
    });

    console.log(`✅ Shortened link: ${shortUrl}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
