echo off
set source=%~dp0
set today=%Date:~10,4%%Date:~4,2%%Date:~7,2%
set t=%time:~0,8%
set t=%t::=%
set t=%t: =0%
set timestamp=%today%_%t%
echo %timestamp%
@echo "#######################################"
@echo "# Executing Mobile Demo UI Testcases #"
@echo "#######################################"
robot --logtitle Mobile_Demo_Report --reporttitle Mobile_Demo_Report --outputdir %source%\Results\UI_Reports KeywordTestcases\Android\Regression_Test_Suite.robot 