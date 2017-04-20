# PatchServ

> Unopinionated static site server with easy, git-enabled collaboration

## Installation

```bash
# Clone repository
$ git clone https://github.com/fallingduck/patchserv.git
$ cd patchserv

# Install dependencies, initialize site, and initialize user database
$ npm install

# Start the server
$ ./patchserv start
```

If you wish to run PatchServ in the background, you can either create a system
service, or use a tool like `forever`:

```bash
$ sudo npm install -g forever
$ forever start index.js start
```

## Creating Your Site

The site which PatchServ serves is updated by pushing to the git repository it
serves in `/site.git`. When you've created and generated your static
site, be sure to modify PatchServ's `config.json` with the place where the built
site can be found within your site's repository (it defaults to expecting
`_site/`, which is used by Jekyll). Then, make sure the built site directory
is being tracked by git, and push to PatchServ.

By default, PatchServ serves on `localhost:3030`. It serves the git repository
for your site on `/site.git`. To access the repository remotely you need to
authenticate (you are prompted to create a user during installation).

```bash
# Example with Jekyll (PatchServ works with any static site generator!)
$ jekyll new wobsite
$ cd wobsite
$ jekyll build

# Remove "_site" from the gitignore
$ vim .gitignore

# Create the git repo
$ git init
$ git add -A
$ git commit -m "Initial commit"

# Push to PatchServ
$ git remote add origin http://localhost:3030/site.git
$ git push -u origin master
```

Now navigate to `http://localhost:3030/` in your browser, and check out
your brand new website!

## Serving to the World

You can edit `config.json` to change the address which PatchServ binds to.

Because you will need to authenticate to push your site to the server, it would
be best to ensure security by TLS or perhaps
[secure layer-3 protocols](https://github.com/cjdelisle/cjdns). The easiest way
to safely open your new PatchServ site to the world is probably by proxying the
locally bound server through a web server like lighttpd, nginx, or Apache.

## Collaboration

You can add more users to the user database, allowing other people to push
updates for the site from anywhere.

```bash
$ ./patchserv user add alice
Password:
Confirm:
Added user alice
```

If other authors don't have access to the server, and don't want to give you
their passwords, then they can use the command `user export`:

```bash
$ ./patchserv user export
Password:
Confirm:
'$2a$10$znBZF0YPZ1mdqCMdPwnEC.NTgXlXjDyg1x2hTmcTORh3jwi5UGsXO'
```

The resulting password hash can then be input to the user database on the
server:

```bash
# Using single quotes is important because of the '$'s
$ ./patchserv user import bob '$2a$10$znBZF0YPZ1mdqCMdPwnEC.NTgXlXjDyg1x2hTmcTORh3jwi5UGsXO'
Added user bob
```

Removing a user is as easy as:

```bash
$ ./patchserv user del alice
Deleted user alice
```

All updates to the user database are immediately reflected, without having to
restart PatchServ.
