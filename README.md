*Note! This workflow requires Node.js to be installed on your machine and in your PATH.*

# Open any existing site in FileZilla through Alfred 3

Use the `fz` trigger followed by your search string to find and open any exixting site in FileZilla's Site Manager.

Because this is a Node.js script it _requires Node.js to be installed on your machine and reachable from your PATH_ on beforehand. Although I don't recommend you install Node.js solely to run this workflow you can find instructions for installing it here: https://nodejs.org/. If you prefer to install it using the [Homebrew package manager](https://brew.sh/) you can simply run `brew install node` in your command line.

I was inspired by [jeffmagill/alfred-open-in-filezilla](https://github.com/jeffmagill/alfred-open-in-filezilla) but unfortunately that workflow doesn't seem to work with Alfred 3.

## Known issues

* Does not work if FileZilla is already open. It seems to be a problem with the FileZilla CLI. The workflow will put FileZilla in focus, but not connect to the site.
