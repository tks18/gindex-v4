const getCommits = require('../helpers/get-commits');
const getDiff = require('../helpers/get-diff');
const getReleases = require('../helpers/get-releases');
const pushRelease = require('../helpers/push-release');
const publishRelease = require('../templates/publish-release');

module.exports = async (options) => {
  const { user, repo, branch, version, dev } = options;
  const latestCommit = await getCommits(user, repo, branch);
  if (latestCommit.success) {
    const {
      releases: { production, development },
    } = version;
    const releaseVersion = dev ? development : production;
    const checkReleases = await getReleases(user, repo, releaseVersion);
    if (checkReleases.success && !checkReleases.releases.exists) {
      const diff = await getDiff(user, repo, latestCommit.commit.sha);
      if (diff.success) {
        const { title, message } = publishRelease(
          user,
          repo,
          dev,
          latestCommit.commit.sha,
          version,
          releaseVersion,
          diff.changelog,
        );
        const releaseStatus = await pushRelease(
          user,
          repo,
          title,
          releaseVersion,
          branch,
          message,
          dev,
        );
        if (releaseStatus.success) {
          return releaseStatus.commit;
        } else {
          return { success: false };
        }
      } else {
        return {
          success: false,
        };
      }
    } else {
      return {
        success: false,
      };
    }
  } else {
    return {
      success: false,
    };
  }
};
