@echo off
echo Building project...
call ng build

:: we need to create this 404.html for ghpages to work with angular router
echo Duplicating index.html into 404.html
type "%CD%\docs\index.html" >> "%CD%\docs\404.html"

echo Adding Commits...
call git add --all
set /p msg=Enter Commit Message...
call git commit -m "%msg%"
call git push