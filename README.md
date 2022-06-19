# encapture-auto-tests

## Requirements

- Python 3.7

# Build project

In order to build the project run the following command

```
pip install -r Requirements.txt
```
# Custom code in White Library

### Support for name locator

```
Navigate to "Python37\Lib\site-packages\WhiteLibrary" and edit "init.py" with IDLE
```
Add following code in int_.py below the line 32 i.e after "help_text={"method": "ByNativeProperty", "property": "HelpTextProperty"},"
```
   name={"method": "ByNativeProperty", "property": "NameProperty"},
```
Save the file "init.py" and run it by pressing the F5 key

### Support forget bulk text

```
Navigate to "Python37\Lib\site-packages\WhiteLibrary\keywords\items" and edit "textbox.py" with IDLE
```
Add following imports in "textbox.py" at the line no 1 
```
import os
from robot.utils import is_truthy
import clr
DLL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'C:\\Python37\\Lib\\site-packages\\WhiteLibrary\\bin', 'TestStack.White.dll')
clr.AddReference('System')
clr.AddReference(DLL_PATH)

```
Add the following keyword after the "get_text_from_textbox" keyword.
```
@keyword
    def get_bulk_text_from_textbox(self, locator):
        """Returns the text of a text box.

        ``locator`` is the locator of the text box or Textbox item object.
        Locator syntax is explained in `Item locators`.
        """
        textbox = self.state._get_typed_item_by_locator(TextBox, locator)
        return textbox.BulkText
```		

Save the file "textbox.py" and run it by pressing the F5 keyword

# Branch naming
Group tokens are used to differenciate different types of branches.

Supported group tokens:
- feature/
- bug/
- hotfix/

So branch name should be like {GROUP_TOKEN} + {DESCRIPTION}
Uppercase is used for Jira ticket name, lowercase kebab-case is used for branch name
description consists of 2-4 words describing branch purpose

Example:
```
feature/add-a-new-feature-name
```

Additional info about group tockens: https://stackoverflow.com/questions/273695/git-branch-naming-best-practices


# Branch merge procedure

After branch is merged, the branch itself should be deleted

# Softwares to install 

1) https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15 to connect to db 
