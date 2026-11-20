#!/bin/zsh
# One-command deploy to GitHub Pages. Needs: `gh auth login` done once.
set -e
cd "$(dirname "$0")"
REPO=${1:-charu-vaibhav-wedding}
OWNER=$(gh api user -q .login)
BASE="/$REPO/"
G="git -c user.name=wedding -c user.email=wedding@users.noreply.github.com"
gh auth setup-git >/dev/null 2>&1 || true

# 1. source code -> main
[ -d .git ] || git init -b main >/dev/null
git add -A; $G commit -m "Wedding invitation" >/dev/null 2>&1 || true
gh repo view "$OWNER/$REPO" >/dev/null 2>&1 || gh repo create "$REPO" --public --source=. --remote=origin >/dev/null
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
git push -u origin main --force

# 2. build for the /REPO/ sub-path and fix the absolute /art, /bg ... paths used in code
npx vite build --base="$BASE"
python3 - "$BASE" <<'P'
import re,sys,glob
base=sys.argv[1]
for f in glob.glob('dist/**/*',recursive=True):
    if f.endswith(('.js','.css','.html')):
        s=open(f,encoding='utf-8').read()
        s=re.sub(r'(["\'`(])/(art|bg|fire|mehendi|decor)/', lambda m: m.group(1)+base+m.group(2)+'/', s)
        open(f,'w',encoding='utf-8').write(s)
P
touch dist/.nojekyll

# 3. publish dist -> gh-pages branch
cd dist
rm -rf .git; git init -b gh-pages >/dev/null; git add -A; $G commit -m "Deploy" >/dev/null
git remote add origin "https://github.com/$OWNER/$REPO.git"
git push -f origin gh-pages
cd ..
gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null 2>&1 || true
echo; echo "LIVE (ready in about 1 minute): https://$OWNER.github.io/$REPO/"
