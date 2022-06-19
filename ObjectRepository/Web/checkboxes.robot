*** Variables ***
${web.checkbox.events.search.select_all}    uEventsCardViewFilterAllActionableEventSelectAll
${web.checkbox.events.search.event_types}    //td[@id="EventTypeDataHolder"]//div[@class='FilterControlRow']//div
${web.checkbox.events.search.event_type}    (//td[@id="EventTypeDataHolder"]//div[@class='FilterControlRow']//div//input[@type="checkbox"])[replaceText]
${web.checkbox.enrollee.event}    //label[contains(text(),'replaceText')]
