// review.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");

// --- Configuration ---
// Get API key from environment variables (set in GitHub Actions)
const geminiApiKey = process.env.GEMINI_API_KEY;
const githubToken = process.env.GITHUB_TOKEN;

// Get the context from the GitHub action
const context = github.context;
const { owner, repo } = context.repo;
const pull_number = context.issue.number;

// Initialize clients
const genAI = new GoogleGenerativeAI(geminiApiKey);
const octokit = new Octokit({ auth: githubToken });

/**
 * Main function to run the code review process.
 */
async function run() {
  try {
    console.log("Starting AI Code Review...");

    // 1. Get the diff of the pull request
    const diff = await getPullRequestDiff();
    if (!diff || diff.length === 0) {
      console.log("No changes detected. Skipping review.");
      return;
    }

    // 2. Get the AI review from Gemini
    const reviewComments = await getAiReview(diff);
    if (!reviewComments || reviewComments.length === 0) {
      console.log("AI analysis complete. No comments to add.");
      return;
    }

    // 3. Post the comments to the pull request
    await postReviewComments(reviewComments);

    console.log("AI Code Review complete.");
  } catch (error) {
    console.error("Error during code review process:", error);
    // Use GitHub Actions' way to fail the workflow
    process.exit(1);
  }
}

/**
 * Fetches the diff of the current pull request.
 * @returns {Promise<string|null>} The diff content as a string.
 */
async function getPullRequestDiff() {
  console.log(`Fetching diff for PR #${pull_number} in ${owner}/${repo}`);
  const { data: diff } = await octokit.pulls.get({
    owner,
    repo,
    pull_number,
    mediaType: {
      format: "diff",
    },
  });
  return diff;
}

/**
 * Gets a review from the Gemini API based on the provided diff.
 * @param {string} diff The diff string to be reviewed.
 * @returns {Promise<Array<Object>>} An array of comment objects.
 */
async function getAiReview(diff) {
  console.log("Sending diff to Gemini API for analysis...");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are an expert code reviewer AI assistant working for a company called "L•E•V•I•'s Code Quality".
    Your task is to review a code diff and provide feedback.
    Analyze the following code changes and provide comments.
    Focus on potential bugs, performance issues, security vulnerabilities, and adherence to best practices.
    Do NOT comment on minor style issues, missing comments, or anything that a linter could catch.
    
    The response MUST be a valid JSON array of objects, where each object has "file", "line", and "comment" keys.
    "file" should be the full path of the file.
    "line" must be a number representing the line in the diff where the suggestion applies.
    "comment" is the constructive feedback you provide.
    
    If there are no issues, return an empty array [].
    
    Here is the diff:
    \`\`\`diff
    ${diff}
    \`\`\`
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json|```/g, "").trim();
    console.log("Raw AI Response:", jsonString);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    console.log("Failing gracefully. No comments will be posted.");
    return []; // Return empty array on error to avoid crashing
  }
}

/**
 * Posts review comments to the GitHub pull request.
 * @param {Array<Object>} comments An array of comment objects from the AI.
 */
async function postReviewComments(comments) {
  console.log(`Posting ${comments.length} comments...`);

  const reviewComments = comments.map(c => ({
    path: c.file,
    body: c.comment,
    line: c.line,
    side: "RIGHT", // Comment on the new code
  }));

  if (reviewComments.length > 0) {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number,
      event: "COMMENT",
      comments: reviewComments,
    });
    console.log("Successfully posted review comments.");
  }
}

// Run the main function
run();