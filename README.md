## Installation

```bash
# Clone repository
$ git clone https://github.com/fallingduck/manutius.git
$ cd manutius

# Install dependencies, initialize site, and initialize user database
$ npm install

# Start the server
$ node index.js serve
```

If you wish to run Manutius in the background, you can either create a system
service, or use a tool like `forever`:

```bash
$ sudo npm install -g forever
$ mkdir logs
$ forever start -l logs/forever.log -o logs/out.log -e logs/err.log index.js
```

## Creating Your Site

The site which Manutius serves is updated by pushing to the git repository it
serves in `/site.git`. When you've created and generated your static
site, be sure to modify Manutius's `config.json` with the place where the built
site can be found within your site's repository (it defaults to expecting
`_site/`, which is used by Jekyll). Then, make sure the built site directory
is being tracked by git, and push to Manutius.

By default, manutius serves on `localhost:3030`. It serves the git repository
for your site on `/site.git`. To access the repository remotely you need to
authenticate (you are prompted to create a user during installation).

```bash
# Example with Jekyll (Manutius works with any static site generator!)
$ jekyll new wobsite
$ cd wobsite
$ jekyll build

# Remove "_site" from the gitignore
$ vim .gitignore

# Create the git repo
$ git init
$ git add -A
$ git commit -m "Initial commit"

# Push to Manutius
$ git remote add origin http://localhost:3030/site.git
$ git push -u origin master
```

Now navigate to `http://localhost:3030/site.git` in your browser, and check out
your brand new website!

## Serving to the World

You can edit `config.json` to change the address which Manutius binds to.

Because you will need to authenticate to push your site to the server, it would
be best to ensure security by TLS or perhaps
[secure layer-3 protocols](https://github.com/cjdelisle/cjdns). The easiest way
to safely open your new Manutius site to the world is probably by proxying the
locally bound server through a web server like lighttpd, nginx, or Apache.
