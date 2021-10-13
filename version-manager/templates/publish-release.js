module.exports = (
  user,
  repo,
  dev,
  commitSha,
  versionInfo,
  version,
  changelog,
) => {
  const title = `${versionInfo.name} Update - ${version.version}`;
  const mdTitle = `**${title}**\n`;
  const devLabel = dev ? `**_Pre-release / WIP Version_**\n` : '';
  const { files, stats } = changelog;
  const threshold = files.length > 10;
  const descriptiveFiles = files.splice(0, threshold ? 11 : files.length);
  let nonDescriptiveFiles, addedFiles, removedFiles, modifiedFiles;
  if (threshold) {
    nonDescriptiveFiles = files.splice(11, files.length - 1);
    addedFiles = nonDescriptiveFiles.filter((file) => file.status == 'added')
      .length;
    removedFiles = nonDescriptiveFiles.filter(
      (file) => file.status == 'removed',
    ).length;
    modifiedFiles = nonDescriptiveFiles.filter(
      (file) => file.status == 'modified',
    ).length;
  } else {
    addedFiles = 0;
    removedFiles = 0;
    modifiedFiles = 0;
  }
  let body = '\n\n';
  body += `**_Changelog for [${commitSha.slice(
    0,
    7,
  )}](https://github.com/${user}/${repo}/commit/${commitSha})_**\n\n`;
  for (const file of descriptiveFiles) {
    body += `* ${file.status} - ${file.name}\n`;
  }
  const addedStatement = addedFiles > 0 ? `✅ ${addedFiles} Files Added,` : '';
  const modifiedStatement =
    modifiedFiles > 0 ? `⛓ ${modifiedFiles} Files Modified, ` : '';
  const removedStatement =
    removedFiles > 0 ? `❌ ${removedFiles} Files Removed` : '';
  if (addedFiles > 0 || removedFiles > 0 || modifiedFiles > 0) {
    body += `* More ${addedStatement}${modifiedStatement}${removedStatement}\n\n`;
  } else {
    body += '\n';
  }

  body += `**Total: ${stats.total}, Additions: ✅${stats.additions}, Deletions: ❌${stats.deletions}**`;

  const message = mdTitle + devLabel + body;
  return { title, message };
};
