# Fix: Remove Stripe Secret from Git History

GitHub blocked your push because a Stripe secret key is in commit `9e74171`.

## Quick Fix Steps:

### Step 1: Remove .env from the problematic commit

```bash
# Checkout the commit before the one with the secret
git checkout 9e74171^
git checkout -b fix-secret

# Remove the .env file
git rm backend/.env
git commit -m "Remove .env file with secrets"

# Cherry-pick the rest of your commits
git cherry-pick 9e74171..main

# Replace main branch
git checkout main
git reset --hard fix-secret
git branch -D fix-secret
```

### Step 2: Force push (after fixing)

```bash
git push origin main --force
```

**⚠️ WARNING:** Force pushing rewrites history. Make sure no one else is working on this branch.

### Step 3: Regenerate Stripe Keys

Since the keys were exposed, you MUST:
1. Go to Stripe Dashboard
2. Revoke the exposed test keys
3. Generate new keys
4. Update your local `.env` file

## Alternative: Use GitHub's Secret Removal

GitHub provided a link to allow the secret. You can:
1. Visit: https://github.com/ikramzafar0343/Scentiment/security/secret-scanning/unblock-secret/38vWb0B784rcbafvSzVPZae8WP1
2. Follow the instructions to remove the secret
3. Then regenerate your Stripe keys

## Prevention

✅ `.env` files are now in `.gitignore`
✅ Never commit files with secrets again
✅ Use `.env.example` files as templates
