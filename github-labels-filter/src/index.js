const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

module.exports = {
  async onPreBuild({constants, utils}) {
    const labelName = getLabelName()
    if (!labelName) {
      console.warn("Failed to label name")
      return
    }

    const ownerRepo = getOwnerRepo()
    if (!ownerRepo) {
      console.warn("Failed to extract owner and repo")
      return
    }

    const prNumber = getPrNumber()
    if (!prNumber) {
      console.warn("Failed to extract PR number")
      return
    }

    const { data: labels } = await octokit.issues.listLabelsOnIssue({
      ...ownerRepo,
      issue_number: prNumber,
      per_page: 100
    })

    const hasLabel = labels.find(label => label.name === labelName)
    if (!hasLabel) {
      utils.build.cancelBuild(`Skipping deployment since '${labelName}' is not added to the PR`)
    }
  },
}

function getOwnerRepo() {
  const match = process.env.REPOSITORY_URL.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    return null
  }

  return {owner: match[1], repo: match[2]}
}

function getPrNumber() {
  const match = process.env.BRANCH.match(/pull\/(\d+)\/head/)
  if (!match) {
    return null
  }

  return match[1]
}

function getLabelName() {
  switch (process.env.SITE_NAME) {
    case 'nostalgic-varahamihira-3bbbd3':
      return 'deploy-nostalgic-varahamihira'
    default:
      return null
  }
}