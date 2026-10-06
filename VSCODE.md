# Keep VS Code on the live site

`www.oetattoo.com` is GitHub Pages from this repo’s **`master`** branch.

## First-time / if you are behind

You must be in the folder that contains `.git` (often `.../OETATTOO_Website/oetattoo`, not the parent `OETATTOO_Website`).

```bash
cd /path/to/oetattoo
git fetch origin
git log -1 --oneline
git log -1 --oneline origin/master
git stash push -u -m "local before pull"
git pull --ff-only origin master
```

Do not paste `#` comment lines into zsh as commands.

## Daily

```bash
git pull origin master
# edit in VS Code
git add -A
git commit -m "short description"
git push origin master
```

A push to `master` deploys the live site (about a minute).

## Read what changed

See `CHANGELOG.md`. Newest work is at the top.
