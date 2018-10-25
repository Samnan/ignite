// @cliDescription  Component library
// @cliAlias l
// ----------------------------------------------------------------------------

const LIBRARY_INDEX_GIST = 'fd8513a906c8da31984c68064f0498e6'

const Gists = require('gists');
const gists = new Gists({
  token: '500595bb413af3debf686837ccde5e543bf1f036'
});

module.exports = async function (context) {
  const { parameters, filesystem, print, prompt } = context

  const filename = parameters.third

  switch (parameters.second.toLowerCase()) {
    case 'search':
      // go out and get the Infinite Red component library
      const res = await gists.get(LIBRARY_INDEX_GIST)

      const components = JSON.parse(res.body.files['library-index.json'].content).components

      const searchResults = components.filter(comp => comp.name.includes(filename))

      // console.dir(searchResults)
      const selection = await prompt.ask({
        type: 'list',
        name: 'component',
        message: `Components matching ${filename}:`,
        choices: searchResults.map(r => r.name + " - " + r.description)
      })

      const selectedResult = searchResults.find(r => (r.name + " - " + r.description) === selection.component)

      const selectedGist = await gists.get(selectedResult.gist)

      filesystem.write('GENERATED_FILE.md', selectedGist.body.files['PLUGINS.md'].content)
      break
    case 'publish':
      // check if a library exists and if we even have permission to publish to it
      // const result = await gists.list('jamonholmgren', {})
        // if doesn't exist, what now?
        // if doesn't have permission, what now?
        // exit gracefully, say "you don't have permission" or whatever        

      // check if the file exists, 
      const exists = filesystem.exists(filename)
      
      // exit gracefully if not exists
      if (!exists) {
        console.log('Input file doesn\'t exist, bailing out...')
        process.exit(1)
      }

      // ask for name, description, tags (comma separated)
      await prompt.ask({
        type: 'input',
        name: 'name',
        message: 'What is your component\'s name?'
      })

      // read the file
      const file = filesystem.read(filename)

      // check if library index already contains this component

      // if component already exists, get that gist so we can update its contents
        // update the gist contents                                

      // If component doesn't exist, create the gist
      gists.create({files: {[filename]: { content: file }}})

      // update the library index with the new (or updated) gist
            
      break
    case 'update':
      console.log('updating' + filename)
      break
    case 'view':
      console.log('viewing' + filename)
      break
  }


  // Get a gist by ID
  // const res = await gists.get('2fa2ae76cc8da96dda1361219cf20f54')
  // console.dir(res.body.files['PLUGINS.md'], { colors: true })


  // Creating gists // 2fa2ae76cc8da96dda1361219cf20f54
  // const res = await gists.create({
  //   description: "Just testing this",
  //   public: false,
  //   files: {
  //     [filename]: {
  //       content: filesystem.read(filename)
  //     }
  //   }
  // })

  // const res = await gists.list('jamonholmgren', {})
  // print.debug(res)


}
