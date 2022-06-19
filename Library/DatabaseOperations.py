import traceback
import pyodbc
import os
from configparser import ConfigParser


class DatabaseOperations(object):

        def __init__(self):
                pass
        
        def _read_config_properties(self):
            config = ConfigParser()
            workingdirectory = os.getcwd()
            config.read(workingdirectory+'\\Library\\db_properties.ini')
            return config
            
                                               
        def _connect_to_db(self):
            data = self._read_config_properties()
            connection_string = 'Driver={ODBC Driver 17 for SQL Server};SERVER='+data.get('db_details','server')+','+data.get('db_details','port')+';database='+data.get('db_details','database')+';Trusted_Connection=no;uid='+data.get('db_details','userid')+';pwd='+data.get('db_details','password')+';SSL=True'
            connection = pyodbc.connect(connection_string)
            return connection
            
          
        def get_batch_info_from_db(self,batch_code):
            conn = self._connect_to_db()
            cursor = conn.cursor()
            cursor.execute("SELECT TOP 1 CAPTURE_BATCH_ID FROM CAPTURE_BATCH CB INNER JOIN BATCH_CONTENT_TYPE BCT ON BCT.BATCH_CONTENT_TYPE_ID = CB.BATCH_CONTENT_TYPE_ID WHERE BATCH_CONTENT_TYPE_CODE = '"+batch_code+"' ORDER BY CREATE_TIME DESC")
            batch_id_details = self.get_data_from_sql_output(cursor)
            batch_id = (batch_id_details[0])['CAPTURE_BATCH_ID']
            cursor.execute("SELECT CAPTURE_BATCH_ID, STEP_CODE, WORKFLOW_STEP_STATUS_CD, REJECT_REASON_CD, COMPLETE_TIME FROM CAPTURE_BATCH CB LEFT OUTER JOIN BCT_PROCESS_STEP BCTPS ON BCTPS.BCT_PROCESS_STEP_ID = CB.BCT_PROCESS_STEP_ID WHERE CAPTURE_BATCH_ID = '"+batch_id+"'")
            batch_details = self.get_data_from_sql_output(cursor)
            return batch_details[0]
    
        def clear_workbench_testdata_from_db(self):
            conn = self._connect_to_db()
            cursor = conn.cursor()
            cursor.execute("delete from ZONE_TEMPLATE")
            conn.commit()
            cursor.execute("delete from CLASSIFICATION_MODEL")
            conn.commit()
            return True
        
        def get_data_from_sql_output(self,cursor):
            column_headers = [column[0] for column in cursor.description]
            results = []
            for row in cursor.fetchall():
                results.append(dict(zip(column_headers, row)))
            return results

        def clear_batches_testdata_from_db(self):
            conn = self._connect_to_db()
            cursor = conn.cursor()
            cursor.execute("DELETE CAPTURE_BATCH")
            conn.commit()
            cursor.execute("DELETE FROM BATCH_CONTENT_TYPE")
            conn.commit()
            cursor.execute("DELETE FROM LINE_OF_BUSINESS")
            conn.commit()            
            return True        

        def clear_data_connections_and_datasources_from_db(self):
            conn = self._connect_to_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM MODULE_VERSION_CONFIG WHERE MODULE_VERSION_ID in ( SELECT MODULE_VERSION_ID FROM MODULE_VERSION INNER JOIN MODULE ON MODULE.MODULE_ID = MODULE_VERSION.MODULE_ID AND MODULE_FEATURE_CD IN ('DataSource', 'Connection'))")
            conn.commit()
            return True        
