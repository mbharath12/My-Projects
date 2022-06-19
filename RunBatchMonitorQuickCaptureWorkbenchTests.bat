echo off
set source=%~dp0
set today=%Date:~10,4%%Date:~4,2%%Date:~7,2%
set t=%time:~0,8%
set t=%t::=%
set t=%t: =0%
set timestamp=%today%_%t%
echo %timestamp%
@echo "#######################################"
@echo "# Executing Encapture BatchMonitor QuickCapture Workbench Testcases #"
@echo "#######################################"
robot --logtitle Encapture_BatchMonitor_QuickCapture_Workbench_Regression_Report --reporttitle Encapture_BatchMonitor_QuickCapture_Workbench_Regression_Report --outputdir %source%\Results\Encapture_BatchMonitor_QuickCapture_Workbench_%timestamp% -A BatchMonitor_QuickCapture_Workbench_TestsList.txt


