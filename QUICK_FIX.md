# Quick Fix for GitHub Secret Detection

GitHub detected a Stripe secret in commit `9e74171`. Here are your options:

## ✅ Option 1: Use GitHub's Link (Easiest)

1. Visit this link: https://github.com/ikramzafar0343/Scentiment/security/secret-scanning/unblock-secret/38vWb0B784rcbafvSzVPZae8WP1
2. Click "Allow secret" (temporary)
3. Push your code
4. **IMMEDIATELY** regenerate your Stripe keys (they're compromised)
5. Remove the secret from history using Option 2

## ✅ Option 2: Remove from History (Proper Fix)

### Method A: Using the script
```powershell
.\fix-git-secret.ps1
git push origin main --force
```

### Method B: Manual steps
```bash
# Remove from all commits
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env" --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin main --force
```

## ⚠️ IMPORTANT: Regenerate Stripe Keys

**Your Stripe test keys are now public!** You MUST:

1. Go to https://dashboard.stripe.com/test/apikeys
2. Revoke the exposed keys:
   - `sk_test_51Suqb92cKM57O4tlnJDcpry6ZYXPx14ecbWRXkgCd2GWMkOeAkgI0vSqQhSicfDNqTjnRv42CuPgb0qIbPIPLYyt00aLk3G21a`
   - `pk_test_51Suqb92cKM57O4tljcPcinkKCbEmRuNrpPs9pgwPIirMilEPdB0hclH91R0kz1KJlZO2itAWxTSJitJJ0pF3X8Oi003zeX8UZx`
3. Generate new keys
4. Update your local `.env` file

## ✅ Prevention

- ✅ `.env` is now in `.gitignore`
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as a template
