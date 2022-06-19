*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Change User to Gateway user
    [Documentation]    Change Login user to Gateway user to access Autoplayer tool.
    ...
    ...    Examples: Change Login to Gateway user
    sleep    2s
    Comment    Change the login user to Root and Gateway user
    Type the Command    sudo su - tdcc

Remove File from Gateway user folder
    [Arguments]    ${file_path}
    Write    rm -rf ${file_path}
    Wait Until Gateway user Prompt

Copy file to Gateway user folder
    [Arguments]    ${source}    ${destination}
    write    sudo cp ${source} ${destination}
    ${output}    read

Validate File should Exists for Gateway user
    [Arguments]    ${folder_name}    ${expected_file_name}
    write    ls ${folder_name}
    ${output}    Wait Until Gateway user Prompt
    @{file_name}    Split String    ${expected_file_name}    /
    ${len}    Get Length    ${file_name}
    Should Contain    ${output}    ${file_name}[${len-1}]

Validate File should not Exists for Gateway user
    [Arguments]    ${folder_name}    ${expected_file}
    write    ls ${folder_name}
    ${output}    Wait Until Gateway user Prompt
    Should Not Contain    ${output}    ${expected_file}

Update Autoplayer Config File
    [Arguments]    ${test_prerequisite_data}
    CustomLibrary.Create Config File    ${test_prerequisite_data}
    Copy local file to remote user folder    loadtest.ini    ${remote_tmp_path}
    Comment    Copy file to Gateway user folder
    Copy file to Gateway user folder    ${remote_tmp_path}    ${autoplayer_loadtest_ini_path}

Get Executed Data Files
    [Arguments]    ${output}
    @{file_names}    CustomLibrary.Get Processed Files By Auto Player    ${output}
    [Return]    ${file_names}

Copy dat files to executed folder
    [Arguments]    ${log}
    Comment    Get processed files after autoplayer execution
    @{files_names}    Get Executed Data Files    ${log}
    FOR    ${file}    IN    @{files_names}
        write    cp ${file} ${executed_data_files_path}
        Wait Until Gateway user Prompt
    END
