*** Variables ***
${db_hostname}    a1db00.lab.veritracks.com
${db_port}        1621
${db_servicename}    a1db01.lab.veritracks.com
${db_A1Client_username}    a1client04
${db_A1Client_password}    a1client04
${db_a1client_viewname}    A1CLIENT04
${db_VT_Device_viewname}    VT_DEVICE
${db_VT_Device_username}    VT_DEVICE
${db_VT_Device_password}    VT_DEVICE
${TO_OPEN_VIOS_Columns}    CT_Open_Vios_id, ct_device_id, ct_tracked_offender_id, violation_id, start_dt,stop_dt,open_flag, close_violation_id,confirmed_flag
${TRACKED_OFFENDER_LAST_CONTACT_Columns}    device_contact_id, ct_device_id, reported_date, contact_date, reported_month, min_track_date, max_track_date,last_valid_track_date, last_valid_latitude, last_valid_longitude, last_battery_level
${TRACKED_OFFENDER_SUMMARY_columns}    ct_tracked_offender_id, created_date, updated_date, has_blutag_flag, is_assigned_flag
${TRACKED_OFFENDER_TRACK_Columns}    device_contact_id, ct_tracked_offender_id, reported_month, track_date, reported_date,latitude, longitude, is_valid, battery_level, battery_low,ct_device_id
${TRACKED_OFFENDER_CONTACT_Columns}    device_contact_id, ct_tracked_offender_id, ct_device_id, contact_month_id, reported_date, contact_date, reported_month, last_valid_track_date, last_valid_latitude, last_valid_longitude
${VT_DEVICE.DEVICE_LAST_CONTACT_Columns}    device_contact_id, ct_device_id, trk_unit_id, reported_date, contact_date, reported_month, min_track_date, max_track_date,last_valid_track_date, last_valid_latitude, last_valid_longitude, last_battery_level
${VT_DEVICE.DEVICE_EVENT_Columns}    alarm_type,CT_Device_ID, TRK_UNIT_ID, Device_Contact_ID, Event_Month, Reported_Date, Device_Date, Event_Date, Event_ID, Latitude, Longitude, Created_Date
${VT_DEVICE_DEVICE_TRACK_Columns}    device_contact_id, ct_device_id, track_month, reported_date,device_date, Track_date, latitude, longitude,battery_level, Is_valid, Exclusion_alarm, inclusion_alarm, battery_Low, tamper_alarm, charger_conn,tag_speed, created_date, is_valid_gps_flag
${VT_DEVICE.DEVICE_CONTACT_Columns}    device_contact_id, ct_device_id,reported_date, contact_date, reported_month, min_track_date, max_track_date,min_violation_date, max_violation_date, last_valid_track_date, last_valid_latitude, last_valid_longitude, last_battery_level
