***Note that you can refine your testing plan as the project development goes. Keep the change log as follow:***

*ChangeLog*


|**Version** |**Change Date**|**By**|**Description**|
| :-: | :-: | :-: | :-: |
|version number|Date of Change|Name of person who made changes|Description of the changes made|
|V1|Feb 17|Yixi Wu|Test existing finished feature with acceptance testCI pipeline run automated unit/integration test|
|V2|Mar 16|Yixi Wu|Test all functional feature|
|||||


 # **Introduction**


## **Scope**

Scope defines the features, functional or non-functional requirements of the software that **will be** tested.

**Functional**

For all of the Functional feature, Unit test and integration test exists, acceptance test step is under this document


**Non-Functional/ LoadTest**

Require Jmeter.
Instruction to run loadtest:
Requires .env file to have connectionString to loadtest DB
1. In backend folder, type "npm run loadtest"
2. Delete the Users Collection in the mongoDB if it exist
3. run the jmx file under the loadtest folder using jmeter

## **Roles and Responsibilities** 



|**Name**|**Net ID**|**GitHub username**|**Role**|
| :- | :- | :- | :- |
|Yixi Wu|wuy8|LimitlessJesse|Developers/Test Manager|
|Michael le|lem2|mike91827|Developers/QA|
|Minh Nam Hai Nguyen|nguyemnh|namhai923|Developers|
|Mohammadafaz Munshi|munshim|afazmunshi49|Developers|


 # **Test Methodology**


 ## **Test Levels**

**Test Levels define the Types of Testing to be executed on the Application Under Test (AUT**).  In this course, **unit testing, integraiton tesing, acceptance testing, regression testing, and laod testing** are mandatory. Please describe how will you do these testings. You may skip load testing at this moment. Please revisit it after the related lecture is given. 

Unit Test:

API test in the backend for all features: ensure that the API gives correct result and fetch correct information from database. Ensure error handling: API gives proper status code and error message when bad request are given like trying to query an unexisted user.
Or trying to send expense record when some account’s balance is not enough.

Integration Test:

Send Records: After sending the records, the database should update

Transfer money:  Using API test, ensure that the database is updated with correct logic change. When transferring money between two account, account balances change correctly for the two account in the database.

Acceptance Test:

Track expense: User should be able to view their remaining balance and past expense history as a table. And it contains information like amount of the expense and date. And they are able to use filtering to filter their expense

Regression Testing:
Setup automated CI pipeline: everytime a PR is created, or a PR is merged, automated  unit tests and integration tests will run.
## **Test Completeness**
Here you define the criterias that will deem your testing complete. For instance, a few criteria to check Test Completeness would be

- 100% code coverage on testable subject (This app puts a lot of try catch so that the application will fail gracefully if error happens, some catch block is hard to reach when running unit test/integration test thus are not covered)
- Automated test will run everytime new changes are push or PR is created
- acceptance test can succeed
- Test can caught bug and be fixed right away if it was created by new PR


# **Resource & Environment Needs**

 ## **Testing Tools**

Make a list of Tools like

- Automation: Github Actions
- Backend test: Jest, supertest, nodejs
- Frontend test: Jest
- Postman to send request to backend and update database


 ## **Test Environment**
- Windows 8 and above
- Github Actions and nodejs


# **Terms/Acronyms** 
Make a mention of any terms or acronyms used in the project


|**TERM/ACRONYM**|**DEFINITION**|
| :- | :- |
|API|Application Program Interface|
|AUT|Application Under Test|

## **Acceptance Test's Test Step**
Please run both the backend and frontend first before doing acceptance test

Transfer Money:
1. As a user, I should be able to see the reduction of the exact transfer amount from my bank account after I complete my transfer. 

Test step: Opean two login page using two different browser, enter the user email "elonmusk@twitter.com" and "daddybezos@amazon.com" respectively, mark down the two account balance. Inside "elonmusk@twitter.com" user, on the left handside menu, click "Send Money", and type in "daddybezos@amazon.com" and enter amount "100", then hit "Send" button. Go back to your "Dashboard" on the left-hand side menu, check your purple card that shows remaining balance, it should be reducted with 100

2. As a user, I should be able to see an increment of total amount in my bank account after someone has transferred me the money.

Test step: Opean two login page using different browser, enter the user email "elonmusk@twitter.com" and "daddybezos@amazon.com" respectively, mark down the two account balance. Inside "elonmusk@twitter.com" user, on the left handside menu, click "Send Money", and type in "daddybezos@amazon.com" and enter amount "100", then hit "Send" button. Go to "daddybezos@amazon.com" account and check its remaining balance in the purple card in the top left corner, it should have 100 increased in the balance.

3. As a user, I want the app to prevent me from transfering more money than I already have in my bank account by showing some kind of alert message.

Test step: Opean login page, enter the user email "anotherdude@gmail.com" mark down the current account balance, on the left handside menu, click "Send Money", and type in "daddybezos@amazon.com" and enter amount that is greater than the account balance, then hit "Send" button. It should 


Track Expense:
1. As a user, I should be able to see my past expense.

Test step: In login page, enter the user email "elonmusk@twitter.com" and click signin. In the left hand sign menu, select expense history, you should be able to see an expense history table.

2. As a user, I should be able to see my remaining balance.

Test step: In login page, enter the user email "elonmusk@twitter.com" and click signin. In the top left corner, you should be able to see a purple card with your account balance.

3. As a user, I should be able to filter/sort my expense based on category/location.

Test step: In login page, enter the user email "elonmusk@twitter.com" and click signin. In the left hand sign menu, select expense history, you should be able to see an expense history table. On the top left corner, click the filter button, choose the category you want to filter, the expense table should shows filter the expense based on the filter label you choose.

4. As a user, I should be able to sum my past expense based on time.

Test step: In login page, enter the user email "elonmusk@twitter.com" and click signin. In the top middle card, you should be able to choose to see the sum of your expense by year or by month.