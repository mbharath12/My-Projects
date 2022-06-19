echo off
set tc_name=%1
set source=%~dp0
set HOUR=%TIME:~0,2%
IF "%HOUR:~0,1%" == " " set HOUR=0%HOUR:~1,1%
set Timestamp=%date:~10,4%-%date:~4,2%-%date:~7,2%-%HOUR%-%time:~3,2%-%time:~6,2%
set results=%source%\Results\%tc_name%_%Timestamp%
@echo "#######################################"
@echo "# Executing Backend Player Testcases #"
@echo "#######################################"
robot --logtitle Backend_Player_Report --reporttitle Backend_Player_Report --outputdir %results% --include %tc_name% --variable RESULTS_FOLDER:%results%  KeywordTestcases\Linux\Test_Suite.robot
