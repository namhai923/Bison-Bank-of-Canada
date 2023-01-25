# Bank of Bison (BoB) Project Proposal

## Summary and Vision

Bank of Bison (BoB) is a banking emulator app designed to provide an intuitive experience of basic banking features. The app can hold multiple accounts and they can transfer money between each account. It can also be used as an expense tracker where users can input their daily expenses into the app. Users should be able to keep track of their expenses easily in different categories such as food, clothes, housing, entertainment and so on. Our vision is that people should have an easy access to their account and an easy way to keep track of their spending. With BoB, you will always Be on Budget!

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

MERN tech stack (MongoDB, Express, React and Node.js) with Jenkins and Docker

## User Stories

## Architectural Diagram

![This is the Architectural Diagram](/ArchitecturalDiagram.png)
