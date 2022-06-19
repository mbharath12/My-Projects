echo off
set failed_output=%1
if [%1]==[] goto usage
set source=%~dp0
set today=%Date:~10,4%%Date:~4,2%%Date:~7,2%
set t=%time:~0,8%
set t=%t::=%
set t=%t: =0%
set timestamp=%today%_%t%
@echo "#######################################"
@echo "# Running again the tests that failed #"
@echo "#######################################"
robot --outputdir %source%\Results\Rerun_Encapture_Tests_%timestamp% --rerunfailed %failed_output% -A UI_TestsList.txt

:usage
@echo Please provide failed output.xml file path
exit 1