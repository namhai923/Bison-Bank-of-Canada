# Bison Bank of Canada (BBC) Project Proposal

## Vision

Let's face it, life was so much simpler when we were kids. But when your an adult and you have responsibilites, such as kids, work and software engineering projects, life gets much more hectic. So why would anyone want their banking to be hard also. We all used to be software developers for BBC news with a busy work schedule, and when we got home and had to try banking with the RBC app (eww), you can understand why we went crazy and had to leave immediately. That is why we made Bison Bank of Canada (BBC) - a banking app so simple and intuitive that no more unneeded stress needs to be added to your life! 

Transfer money in seconds! Track your expenses with ease! Scotiabank sucks! Join us now!

## Summary

Bison Bank of Canada (BBC) is a banking web application that runs on any browser. It has a user interface that will allow users to track their past expenses, add and transfer money between different accounts. A retailer, using a special interface, can charge a user of BBC for a specific purchase which will reflect on the user’s bank account under the expenses. 

A vital feature that our app provides is transferring money between accounts. Two different accounts should be able to transfer money between accounts as long as they have each other’s account numbers. It is as simple as entering the bank account number, and the amount in the user interface provided for transferring the money and clicking the submit button. For security reasons, our app lets the sender of the money know the receiver's name after they enter their bank account number.

Before taking advantage of any of the aforementioned features, users must add money to their bank account. Adding money to a bank account cannot be simpler. A user simply adds the desired amount of money to their bank account through the user interface, which will automatically update their record. 

With more teenagers entering adulthood and living independently, BBC is the best place to start their journey into learning the basics of banking. Our team aspires to improve this app in the future. We shall add security features like users requiring authentication before sending or receiving money. Furthermore, our team would like to improve the retailer’s user interface - it will help improve the user’s past expense interface in the main UI.

## Core features
#### 1. Tracking user's expense
After signing in, a webpage interface will show up the signed-in account remaining balance and show the past expense record so that account owners can keep track of their spending.

#### 2. Transferring money between accounts 
After signing in, the web interface will have an option for people to transfer their money to a different account

#### 3. Sending transaction records to the system

The server will have a way to accept transaction records and update related account balances based on the information stored in the records.

#### 4. Non Functional Feature: Server should be able to handle heavy load from both user and incoming transaction

The server can handle more than 500 users usage at the same time or 500 transaction records within 1 minute

## Technologies

MERN tech stack (MongoDB, ExpressJS, ReactJS/AngularJS and NodeJS) with Jenkins and Docker

## User Stories

Transfer Money:
1. As a user, I should be able to see the reduction of the exact transfer amount from my bank account after I complete my transfer.
2. As a user, I should be able to see an increment of total amount in my bank account after someone has transferred me the money.
3. As a user, I want the app to prevent me from transfering more money than I already have in my bank account by showing some kind of alert message.

**optional:**

4. As a user I want the app to show me the name of the receiver after entering their bank account number so that I can confirm the name of the person I want to transfer my money to before sending it.
5. As a user, I should be able to set a 4 digit pin for the receiver to enter before the money gets transferred to their bank account.
6. As a user and receiver of money, I should be able to enter the 4 digit pin set by user before I can accept the transfer.
7. As a user I want the app to show me a confirmation dialog (or a JS alert dialog) to confirm the amount before sending the money.
8. As a user and receiver of money, I want the app to show me the transfer request from the sender so that everytime someone sends me a transfer I can approve it on my end.

Track Expense:
1. As a user, I should be able to see my past expense.
2. As a user, I should be able to see my remaining balance.
3. As a user, I should be able to filter/sort my expense based on category/time/amount.
4. As a user, I should be able to sum my past expense based on time/category.

**optional:**

5. As a user, I should be able to add notes to my past expense.

Send Transaction records:
1. As a retailer user, I should be able to send a list of transaction to server. 

# New Feature added
Account creation.
- As an user, I should be able to create a new account
- As an user, I should be able to log in with my account
(This feature is newly added in our sprint 2 and it is partially finished, but we can log in and UI/logic exists) 

## Architectural Diagram

![This is the Architectural Diagram](/ArchitecturalDiagram.png)

## Sequence Diagram

Track Expense Sequence
![This is the sequence Diagram](/TrackExpenseSeq.png)

Send Records Sequence
![This is the sequence Diagram](/SendRecordsSeq.png)

Transfer Money Sequence
![This is the sequence Diagram](/TransferSeq.png)

## Running the app
Run backend:
cd into the back-end folder first, you will need a .env file with the following content: (for ease of grading/testing purpose, we are stroing this secret in README in plain text)

PORT=5000
DB_URL=mongodb+srv://BBCNews:QEXVgUC6qDmNwzxG@cluster0.iw74dsb.mongodb.net/Bison-Bank-of-Canada?retryWrites=true&w=majority
TESTDB_URL=mongodb+srv://BBCNews:QEXVgUC6qDmNwzxG@cluster0.iw74dsb.mongodb.net/Test-DB?retryWrites=true&w=majority

This file needs to be under the back-end folder.

Inside the back-end foler, type "npm install" then "npm start" to run it

Run frontend:
cd into the front-end folder. If you don't have node_modules in that folder, run "npm install" on the terminal to install the dependencies. Run "npm start" to start the front-end server. The server will run on localhost:3000. 

## Instructions (Please Read)
This section will explain additional instructions about how to use certain features

Login into an account:
When you first log in into the website, you will be on the home page. You will be defaultly logged into Elon Musk's account (elonmusk@twitter.com). If you want to login with a different account, go to the sidebar on the left and click on Authentication => Login. Here you will be redirected to the login page where all you need to do is type in a user's email to log in to their account.

Pre-existing account:
This is a list of preexisting accounts that all have unique characterstics about them:
    - elonmusk@twitter.com - relatively normal account
    - daddybezos@amazon.com - account with a few expenses
    - Jessewu1999@gmail.com - account with a lot of expenses
    - anotherdude@gmail.com - account with no expenses

User Expense Table Colors:
You may wonder what the colored squares on the user's expense table on the home page means. The colored squares correspond to the price of the expense it is next to. 
    - Green means the transactions is $10 or less
    - Yellow means it is between $10 to $50
    - Red means it is higher than $50

Send Transactions record using postman:
download postman
Start the backend
And send a record with the following format
![This is a tutorial to send postman request](/SendRecordsPostman.png)
You can send as many record item as you want, the list does not limit to only two records, but all the fields are needed

Trigger docker push
