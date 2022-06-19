*** Variables ***
${textbox.login.username}    //android.widget.EditText[@index='0']
${textbox.login.password}    //android.widget.EditText[@index='1']
${textbox.enrollee.first_name}    //android.widget.EditText[@content-desc="enrollee firstname"]
${textbox.enrollee.last_name}    //android.widget.EditText[@content-desc="enrollee lastname"]
${textbox.enrollee.primary_id}    //android.widget.EditText[@content-desc="enrollee primaryid"]
${textbox.enrolle.addenrolle.firstname}    //android.widget.EditText[@text='First Name']
${textbox.enrolle.addenrolle.lastname}    //android.widget.EditText[@text='Last Name']
${textbox.enrolle.addenrolle.primaryid}    //android.widget.EditText[@text='Primary Id']
${textbox.enrollee.search.first_name}    //android.view.View[@text='Enrollee']/following::android.widget.EditText[@index='0']
${textbox.enrollee.search.last_name}    //android.view.View[@text='Enrollee']/following::android.widget.EditText[@index='1']
${textbox.enrollee.search.primary_id}    //android.view.View[@text='Enrollee']/following::android.widget.EditText[@index='2']
${textbox.enrolle.search.textbox}    //android.widget.EditText[@text='replaceText']
${textbox.enrolle.case_note}    //android.widget.EditText[@text='Enter note']
${textbox.enrolle.profile.chat}    //android.widget.EditText[@content-desc="Type a message..."]
${textbox.enrollee.event.detail.add_event_note}    //android.widget.EditText[@text='Enter note']
${textbox.account.Please_enter_Feedback}    //android.widget.EditText[@text='Please enter Feedback...']
${enrolle.editenrolle.risklevel}    xpath=((//android.view.ViewGroup[@content-desc="TimeZone Container"]//..//..)[1]//following-sibling::android.view.ViewGroup)[23]
${enrolle.editenrolle.deviceassignment}    xpath=((//android.view.ViewGroup[@content-desc="TimeZone Container"]//..//..)[1]//following-sibling::android.view.ViewGroup)[28]