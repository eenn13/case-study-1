# Case study for Kentkart Hiring process
# Prepared by Eren Türkel, 14.11.2024

# Welcome Screen
- The screen where the user can go to himself instead of opening the application directly
- You should log in with Gmail by pressing the Access to application button

# Logging with Gmail
- Google OAuth service used for login in auth.service.ts
- URL for auth-callback.component is already given to Google service. Google is going to redirect you to auth-callback
- After you logged in with Google service, you will be redirected to application by auth-callback.component

# Application
- After authentication you can create companies and their employees from collapsible forms
- In the middle of the screen, companies are listed and under the companies, employees are listed.
- Details of companies and their employees can be read, updated and deleted from the relevant icons on them.
- Companies with no employees are colored more dull

# Future Tasks
- Search feature can be added
- Sorting by number of employees
- Displaying the number of employees on the card
- Various sorting options
- Uploading images