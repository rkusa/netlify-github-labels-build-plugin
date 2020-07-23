module.exports = {
  async onPreBuild({constants, utils}) {
    console.log(constants)
    console.log(utils.git)
    console.log('Hello world from onPreBuild event!')
  },
}