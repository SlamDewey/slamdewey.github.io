@echo off
call ng build
echo docs/index.html > docs/404.html
call git add --all
set /p msg=Enter Commit Message...
call git commit -m "%msg%"
call git push