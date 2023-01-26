# Bison Bank of Canada (BBC) Project Proposal

## Summary and Vision

Bison Bank of Canada (BBC) is a banking emulator app designed to provide an intuitive experience of basic banking features. The app can hold multiple accounts and they can transfer money between each account. Users should be able to keep track of their expenses easily in different categories such as food, clothes, housing, entertainment and so on. Our vision is that people should have an easy access to their account and an easy way to keep track of their spending. With BBC, !

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
4. As a user and receiver of money, I want the app to show me the transfer request from the sender so that everytime someone sends me a transfer I can approve it on my end.
5. As a user I want the app to show me the name of the receiver after entering their bank account number so that I can confirm the name of the person I want to transfer my money to before sending it.

**optional:**

6. As a user, I should be able to set a 4 digit pin for the receiver to enter before the money gets transferred to their bank account.
7. As a user and receiver of money, I should be able to enter the 4 digit pin set by user before I can accept the transfer.
8. As a user I want the app to show me a confirmation dialog (or a JS alert dialog) to confirm the amount before sending the money.

Track Expense:
1. As a user, I should be able to see my past expense.
2. As a user, I should be able to see my remaining balance.
3. As a user, I should be able to filter/sort my expense based on category/time/amount.
4. As a user, I should be able to sum my past expense based on time/category.

**optional:**

5. As a user, I should be able to add notes to my past expense.

Send Transaction records:
1. As a retailer user, I should be able to send a list of transaction to server. 

## Architectural Diagram

![This is the Architectural Diagram](/ArchitecturalDiagram.png)
