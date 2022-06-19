*** Variables ***
${web.button.events.search}    //span[@class='cLocalize cEventFindEvents']
${web.button.events.search.filter}    uEventsCardViewFilterFilterButton
${web.button.events.search.filter.event}    //div[@title='replaceText1']//following-sibling::div[@title="replaceText2"]
${web.button.signin}    uLoginButton
${web.button.continue}    uContinueButton
${web.button.org.continue}    //div[@class='Button' and text()='Continue']
${web.button.warning.accept}    //span[text()='Accept']
${web.button.dashboard.logout}    //span[text()='logout']
${button.web.enrollee.enrollee_search}    //span[text()='Enrollee Search']
${button.web.enrollee.find}    uOffendersCardViewFilterFilterButton
${web.button.dashboard.tabs}    (//span[text()='replaceText'])[2]
${web.button.dashboard}    //span[text()='Dashboard']
${web.button.find_events}    //span[@class="cLocalize cEventFindEvents"]
${web.button.enrollee.find_events}    uEnrolleesEventsListViewFilterFilterButton
${web.button.enrollee.events}    //span[@class="cLocalize cEnrolleeEvents"]
${web.button.enrollee.tab}    (//span[contains(@class,"cLocalize creplaceText")])[1]
