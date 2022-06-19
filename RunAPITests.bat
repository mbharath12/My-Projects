echo off
set source=%~dp0
set today=%Date:~10,4%%Date:~4,2%%Date:~7,2%
set t=%time:~0,8%
set t=%t::=%
set t=%t: =0%
set timestamp=%today%_%t%
echo %timestamp%
@echo "#######################################"
@echo "# Executing Encapture API Testcases #"
@echo "#######################################"
robot --logtitle Encapture_API_Report --reporttitle Encapture_API_Report --outputdir %source%\Results\Encapture_API_%timestamp% -A API_TestsList.txt


