# Peace COrP

## Installation
### Dependencies
1. Download and install the latest LTS [Node.js](https://nodejs.org) version
2. Verify that Node is installed in your Command Line Interface (CLI): 
 ```
 $ node -v && npm -v
 ```
3. Install [Yarn](https://yarnpkg.com) globally with the [Node Package Manager](https://www.npmjs.com/) (NPM) installed
```
$ npm install -g yarn
```

### Repository
1. [Clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) this repository
2. Navigate to Development directory in your CLI
```
$ cd code/Development
```
3. Install the repository dependencies with Yarn in repository root. 
```
$ yarn install 
```
4. Create a symbolic link to `node_modules` directory in repository root.
```
$ ln -s ./node_modules ./../../node_modules
```
5. Build the project
```
$ npm run build
```
6. Run the server
```
$ npm start
```
7. Navigate to the path indicated in the CLI.


## Reference
### Repositories
- [Traits](https://github.com/traitsjs/traits.js)
- [Context Traits](https://github.com/tagae/context-traits)
- [q-learning.js](https://github.com/nrox/q-learning.js)

### Articles
- [Deep Q Learning with Keras and Gym](https://keon.io/rl/deep-q-learning-with-keras-and-gym/)

### JavaScript Rules
- [JSHint Options](http://jshint.com/docs/options/)
- [ESLint Rules](http://eslint.org/docs/rules/)



## Draft
Some 
Integrated Development Environments (IDEs) and source code editors works better 
if `node_modules` directory is there.

**Note:** If you see a file named `yarn.lock` in the root, you executed the command wrong.
Delete the file, ensure that you are in `Development` directory and try again.
