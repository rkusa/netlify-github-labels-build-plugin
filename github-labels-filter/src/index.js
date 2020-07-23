const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

module.exports = {
  async onPreBuild({constants, utils}) {
    console.log(constants)
    console.log(utils.git)
    console.log(process.env)
    console.log('Hello world from onPreBuild event!')
  },
}