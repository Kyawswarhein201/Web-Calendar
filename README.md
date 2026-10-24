
# My Calendar

## Project Overview

My Calendar is a simple web-based calendar application
inspired by Google Calendar.

This project was developed for a web programming
assignment using React, JavaScript, HTML, CSS,
Visual Studio Code, and Node.js.

## Project Objectives

1. Display a monthly calendar.
2. Allow users to manage their events.
3. Provide an easy-to-use interface.
4. Save event information in the browser.
5. Practice React and JavaScript programming.

## Main Features

- View a monthly calendar
- Navigate to previous and next months
- Return to today's date
- Select a calendar date
- Add new events
- Edit existing events
- Delete events
- Search events by title
- View upcoming events
- Display total event count
- Save events using localStorage

## Technologies Used

- HTML: Web page structure
- CSS: Website design and layout
- JavaScript: Calendar and event operations
- React: Interactive user interface
- Node.js: Development environment
- Vite: Development server and build tool
- localStorage: Browser data storage

## How to Run

1. Install Node.js.
2. Open the project folder in VS Code.
3. Open the VS Code terminal.
4. Run:

   npm install

5. Start the development server:

   npm run dev

6. Open the local URL displayed in the terminal.

If PowerShell blocks npm.ps1, use npm.cmd instead.

## How the Application Works

The application uses React state to manage the
selected date, displayed month, and event information.

When a user creates an event, the program adds
a new event object to the events array.

When editing, the program uses the event ID to
find and update the correct event.

When deleting, the program removes the selected
event from the array.

The useEffect hook saves event changes to
localStorage automatically.

## Project Limitations

- No Google account synchronization
- No online database
- No automatic notifications
- Events are saved in the current browser

## Conclusion

This project demonstrates basic web development,
React state management, JavaScript functions,
array operations, and browser storage.

The application is designed to be simple,
functional, and easy to use.
