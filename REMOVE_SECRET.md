# Removing Secret from Git History

GitHub detected a Stripe secret key in your commit history. Follow these steps to remove it:

## Option 1: Use Git Filter-Branch (Recommended)

```bash
# Remove backend/.env from all commits
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env" --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

## Option 2: Use BFG Repo-Cleaner (Faster)

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
```bash
java -jar bfg.jar --delete-files backend/.env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force --all
```

## Option 3: Create New Repository (Safest)

If the above doesn't work, create a fresh repository:
1. Create a new repo on GitHub
2. Remove .env from current repo
3. Push to new repo

## After Removal

1. Regenerate your Stripe API keys (they're compromised)
2. Update your local .env file with new keys
3. Never commit .env files again
