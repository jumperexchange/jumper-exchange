// API call: /meta/_health

const data = { isHealthy: true };

export async function GET() {
  let hasUpdateAvailable = false;
  try {
    const latestCommitSHA = process.env.NEXT_PUBLIC_LATEST_COMMIT_SHA;
    const githubLatestCommitShaResponse = await fetch(
      `https://api.github.com/repos/jumperexchange/jumper-exchange/commits/${latestCommitSHA}/branches-where-head`,
      { next: { revalidate: 3600 } },
    );

    if (!githubLatestCommitShaResponse.ok) {
      throw new Error('New update available');
    }

    const githubLatestCommitShaData =
      await githubLatestCommitShaResponse.json();

    if (githubLatestCommitShaData.length > 0) {
      hasUpdateAvailable = false;
    }
  } finally {
    return Response.json({ ...data, hasUpdateAvailable });
  }
}
