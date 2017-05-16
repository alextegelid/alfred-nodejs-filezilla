*Note! This workflow requires Node.js to be installed on your machine.*

# Open any existing site in FileZilla through Alfred 3

Use the `fz` trigger followed by your search string to find and open any exixting site in FileZilla's Site Manager.

Because this is a Node.js script it _requires Node.js to be installed on your machine_ on beforehand. Although I don't recommend you install Node.js soley to run this workflow you can find instructions for installing it here: https://nodejs.org/. If you prefer to install it using the [Homebrew package manager](https://brew.sh/) you can simply run `brew install node` in your command line.

## Known issues

* Does not work if FileZilla is already open. I't seems to be a problem with the FileZilla CLI. The workflow will put FileZilla in focus, but not connect to the site.
