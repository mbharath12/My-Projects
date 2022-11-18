*** Variables ***
${common.search.addexist}    //div[contains(@class,'ui active visible fluid')]//div[@role='option']//span[contains(text(),'${value}')]
${common.search.addnew}    //div[contains(@class,'ui active visible fluid')]//div[@role='option']//span/b[contains(text(),'${value}')]
${common.btn.save}    //button[text()='Save']
${common.btn.cancel}    //button[text()='Cancel']
${common.btn.create}    //button[text()='Create']
${common.dropdown.items}    //div[contains(@class,'ui active visible fluid')]//div[@role='option']
