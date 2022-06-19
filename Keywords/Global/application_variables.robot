*** Variables ***
&{EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU}    Create_New_Batch=0    Open_Existing_Batch=1    Start_Scanning_With_Cur_Settings=2    Stop_Scanning=3    Import_Electronic_File=4    Create_Empty_Document=5    Cut=6    Copy=7    Paste=8    Delete_Selected_Items=9    Copy_Custom_Fields_From_Prev_Doc=10    Copy_Custom_Fields_To_All_Following_Docs=12    Split_Document=NA    Merge_Documents=NA    Revert_Batch=NA    Undo=NA    Mark_Page_As_Best_Available=15
...               Complete_Batch=16    Suspend_Batch=17    Delete_Batch=18    Automatic_New_Batch_Creation=NA    Rotate_Page_90_Degree_To_Left=20    Rotate_Page_180_Degrees=21    Rotate_Page_90_Degree_To_Right=22    Zoom_In=23    Zoom_Out=24    Zoom_Level=25    Zoom_To_Selection=26    Prev_Doc_In_Batch=27    Previous_Page=28    Next_Page=29    Next_Doc_In_Batch=30    Next_Error=31    Help=NA
&{EXPERT_INDEX_BATCH_TOOL_BAR_MENU}    Open_Index_Existing_Batch=1    Release_Batch=1    Start_Scanning_With_Cur_Settings=3    Stop_Scanning=3    Import_Electronic_File=5    Create_Empty_Document=6    Cut=7    Copy=8    Paste=9    Delete_Selected_Items=10    Copy_Custom_Fields_From_Prev_Doc=10    Copy_Custom_Fields_To_All_Following_Docs=11    Split_Document=12    Merge_Documents=NA    Revert_Batch=NA    Mark_Document_Rescan=15    Reject_Document=16
...               Revert_Batch=18    Undo=19    Mark_Page_As_Best_Available=20    Complete_Batch=21    Suspend_Batch=22    Reject_Batch=23    Delete_Batch=24    Rotate_Page_90_Degree_To_Left=25    Rotate_Page_180_Degrees=26    Rotate_Page_90_Degree_To_Right=27    Zoom_In=28    Zoom_Out=29    Zoom_Level=30    Zoom_To_Selection=31    Prev_Doc_In_Batch=32    Previous_Page=33    Next_Page=34
...               Next_Doc_In_Batch=35    Next_Error=36
${is_prerequisites_created}    False
&{BATCH_MONITOR_TOOL_BAR_MENU}    View_Batches=0    Document_List=NA    Batch_Details=3    Event_History=4    Clean_Up_Status=5    Open_Batch=7    Change_Priority=ChangePriority    Change_Status=ChangeStatus    Search_Button=1    Rest_Search_Criteria=2    Refresh=1
&{SEARCH_ACTIVITY_EDIT_TEXT_BOX}    Locator=0    From=1    To=2    User=3    Station=4    Site=5
&{SEARCH_ACTIVITY_SELECT_COMBO_BOX}    Content Type=0    Status=1    Priority=2
@{EVENTS_HISTORY_EXPECTED_DATA}    Capture|Start    Capture|Complete
&{WORKBENCH_TOOL_BAR_MENU}    NEW_CLASSIFICATION_MODEL=0    OPEN_CLASSIFICATION_MODEL=1    DELETE_CLASSIFICATION_MODEL=2    RENAME=3    CHECK_OUT=4    CHECK_IN=5    UNDO_CHECK_OUT=6    DEPLOY_RUN_TIME=7    NEW_ZONE_TEMPLATE=0    OPEN_ZONE_TEMPLATE=1    DELETE_ZONE_TEMPLATE=2
${workbench_classification_model_expand}    False
${workbench_zone_template_expand}    False
&{EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}    Complete_Batch=15    Suspend_Batch=16    Delete_Batch=17    Prev_Doc_In_Batch=26    Next_Page=28    Cut=6
&{EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}    Complete_Batch=20    Suspend_Batch=21    Reject_Batch=22    Delete_Batch=23    Cut=5    Prev_Doc_In_Batch=31    Previous_Page=32    Next_Page=33    Next_Doc__In_Batch=34
${APPLICATION_ENCAPTURE_ORCHESTRATE}    Encapture Orchestrate
${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}    Encapture Expert Capture
${APPLICATION_ENCAPTURE_REVIEW}    Encapture Review
${ENCAPTURE_ADMIN}    Orchestrate
${APPLICATION_EXPERT_CAPTURE}    Expert Capture
${APPLICATION_REVIEW}    Review
${APPLICATION_MONITOR}    Monitor
${APPLICATION_ENCAPTURE_COLLECT}    Encapture Collect
${APPLICATION_COLLECT}    Collect
${ORCHESTRATOR_TIME_OUT_WINDOW_CLASS_NAME}    WindowsForms10.Window.8.app.0.3d893c_r3_ad1
${APPLICATION_CLASSIFY_AND_EXTRACT}    Classify & Extract
