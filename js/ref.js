import { Octokit } from '@octokit/rest';
import { readFileSync } from 'fs';

const token = process.env.INPUT_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const eventPath = process.env.GITHUB_EVENT_PATH;

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

const main = async () => {
  try {
    if (!token || !repo || !eventPath) {
      throw new Error("Missing GitHub token or context");
    }

    const [owner, repoName] = repo.split("/");
    const event = JSON.parse(readFileSync(eventPath, 'utf8'));

    const issueNumber = event.issue?.number;
    const issueTitle = event.issue?.title;

    if (!issueNumber || !issueTitle) {
      throw new Error("Missing issue number or title");
    }

    const octokit = new Octokit({ auth: token });

    if (!isValidUrl(issueTitle)) {
      await octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: issueNumber,
        body: "❌ Error: The issue title must be a valid URL starting with http:// or https://",
      });
      console.error("Invalid URL:", issueTitle);
      return;
    }

    const shortCode = Buffer.from(String(issueNumber + 10))
      .toString("base64")
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const shortUrl = `https://jbenedict.com/link/${shortCode}`;

    await octokit.issues.createComment({
      owner,
      repo: repoName,
      issue_number: issueNumber,
      body: `✅ Your shortened link: ${shortUrl}`,
    });

    console.log(`✅ Shortened link created: ${shortUrl}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
