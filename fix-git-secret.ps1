# Script to remove backend/.env from git history
# Run this from the repository root

Write-Host "Removing backend/.env from git history..." -ForegroundColor Yellow

# Step 1: Remove from current commit if it exists
git rm --cached backend/.env 2>$null

# Step 2: Use filter-branch to remove from all commits
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env" --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully removed .env from git history!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Review the changes: git log --oneline"
    Write-Host "2. Force push: git push origin main --force"
    Write-Host "3. ⚠️  REGENERATE your Stripe keys - they were exposed!" -ForegroundColor Red
} else {
    Write-Host "`n❌ Error removing file. Try manual method in FIX_SECRET.md" -ForegroundColor Red
}
