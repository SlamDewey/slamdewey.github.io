:: Gh-Pages is reading the static files from the docs/ folder in this repo and
:: serving this at https://slamdewey.github.io/
:: This .bat file serves as a script to create, commit, and push new build artifact.

@echo off
call npm run build:prod

:: we need to create this 404.html for ghpages to work with angular router
echo Duplicating index.html into 404.html
type "%CD%\docs\index.html" >> "%CD%\docs\404.html"

call git add docs/*
call git commit -m "build (auto-rebuild): deploy.bat is creating this new build artifact"
call git push
echo Deploy Complete
