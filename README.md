Node.js  Job Application Tracker  API
The Job Application Tracker is a platform designed to help job seekers organize and track their job applications. It allows users to manage their job search process, including logging job applications, setting reminders for follow-ups, storing company-related information, and visualizing their application progress. 

SETUP

$ git clone https://github.com/harshithas96/job-application-tracker.git
$ cd job-application-tracker
$ npm install

Duplicate and database.config example.js as database.config.js and fill in environment variables

Run The Service
$ nodemon app.js


API ENDPOINTS

1. USER ROUTES 

* Create User
POST | /register

 Key	      Value
name	     Test
email	     test123@gmail.com
phoneNumber	 9876543245
password	 Test@123

* Login User
POST  | /login

 Key	      Value
email	     test123@gmail.com
password	 Test@123

* Refresh Token
POST | /refresh-token

* Change Password
PUT | /change-password

 Key	      Value
oldPassword	 Test@123
newPassword	 Change@123

* Forgot Password
POST | /forgot-password

 Key      Value
email   test123@gmail.com

* Reset Password
POST | /reset-password

 Key          Value
token       <which u get via mail>
newPassword  Test@12345

* Logout User
POST | /logout

* Get All User Details
GET | /get-all-users

* Get LoggedIn User Details
GET | /get-loggedin-details

* Update User Details
PUT | /update-details

 Key             Value
careerGoals     "Become a backend developer"
linkedinUrl     "https://linkedin.com"
location        "Bangalore"
experienceLevel ["fresher", "junior", "mid", "senior"]

* Delete User
DELETE | /delete-user

 Key    Value
userId  <get from db>


2. JOB APPLICATION ROUTES

* Create Application
POST | /applications

* Get Applications
GET | /applications

* Get Application by id
GET | /applications/:id

* Update Application
PUT | /applications/:id

* Delete Application
DELETE | /applications/:id


3. REMINDER ROUTES

* Create Reminder
POST | /reminders

* Get Reminder
GET | /reminders

* Update Reminder
PUT | /reminders/:id

* Delete Reminder
DELETE | /reminders/:id


4. COMPANY ROUTES

* Create Company
POST | /companies

* Get Company
GET | /companies

* Update Company
PUT | /companies/:id

* Delete Company
DELETE | /companies/:id


5. JOBLISTING ROUTES

* Create JobListing
POST | /job-listings

* Get JobListing
GET | /job-listings

* Update Job Listing
PUT | /job-listings/:id/applied

* Delete JobListing
DELETE | /job-listings/:id


6. DASHBOARD ROUTES

* Get Dashboard Overview
GET | /dashboard/overview

* Get Dashboard status
GET | /dashboard/status-chart

* Get Dashboard timeline
GET | /dashboard/timeline

* Get Dashboard metrics
GET | /dashboard/metrics


7. NOTES ROUTES

* Create Notes
POST | /applications/:applicationId/notes

* Get Notes
GET | /applications/:applicationId/notes

* Update Notes
PUT | /applications/notes/:noteId

* Delete Notes
DELETE | /applications/notes/:noteId


8. JOB SEARCH ROUTES

* Get Applications
GET | /applications/search