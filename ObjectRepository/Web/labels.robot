*** Variables ***
${web.label.events.search.filter.eventsview}    uEventsCardView
${web.label.events.search.filter.event.is_confirmed}    //div[@title="replaceText1"]//following-sibling::div[@title="replaceText2"]/..//following-sibling::div[@class="ExtendedDetail"]//child::div[@class="HeightProperty ConfirmedIconProperty" and (text()=': Yes')]
${web.label.dashboard.username_profile}    uHeaderUserName
${web.label.dashboard.agree_popup}    uPopupContainer
${labels.searched_enrollee}    //div[contains(text(),'replaceText') and @class='Property EnrolleeProperty PropertyTitle']
${labels.searched_enrollee.fullname}    uOffenderProfileFullName
${labels.searched_enrollee.organization}    uOffenderProfileOrganizationId
${labels.searched_enrollee.primaryId}    uOffenderProfilePrimaryId
${labels.searched_enrollee.risklevel}    uOffenderProfileRiskLevelId
${labels.searched_enrollee.assigned_device}    //div[text()='replaceText']//following::div[13]
${web.label.events.search.search_fields}    uOffendersCardViewFilterExpander
${web.label.enrollee.event.id}    //div[@class='sumo-listview-data-cell uEnrolleesEventsListViewId-data ' and contains(text(),'replaceText')]
${web.label.enrollee.event.column_id}    //span[@class="cLocalize cId"]
