echo off
set source=%~dp0
set today=%Date:~0,2%_%Date:~3,2%_%Date:~6,8%
set t=%time:~0,8%
set t=%t::=%
set t=%t: =0%
set timestamp=%today%_%t%
echo %timestamp%
@echo "#######################################"
@echo "# Publishing Test Results in Testrail #"
@echo "#######################################"

xcopy "%source%\Results\UI_Reports" "%source%\Results\UI_Reports_%timestamp%\" /s/h/e/k/f/c

python %source%TestrailIntegration\robotframework2testrail.py --tr-config=%source%testrail.cfg --tr-run-id=968 %source%Results\UI_Reports\output.xml