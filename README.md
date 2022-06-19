#stop-mobile-auto

## Requirements

- Python 3.7 or greater

# Build project
In order to build the project execute the following command in cmd or terminal

for Windows:

```
build.bat
```

for mac:
```
sh build.sh
```

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