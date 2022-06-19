# technomile-auto-tests

## Introduction:
This is web automation framework, implemented using Java, Selenium/Webdriver, TestNG & Maven.
Page Object Model (POM) is used to  make the code more readable, maintainable, and reusable.

## Prerequisite:

1. JDK 8 (Install from here https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)
2. Browsers (Chrome is enough)
3. Intellij (Please install "community edition" https://www.jetbrains.com/idea/download/#section=mac)
4. Maven (Install from here https://maven.apache.org/download.cgi)

## Build Project:

After cloning the project, Got inside the project folder and run below command

`mvn clean install`

## Run Tests:

run below command:

`runtest.bat`
   or 
 `mvn clean test -Pregression-tests`

## Branch naming:
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


## Branch merge procedure:

After branch is merged, the branch itself should be deleted
