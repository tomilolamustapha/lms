import 'typings/express-session'; // Import the express-session module

declare module 'express-session' {
  interface SessionData {
    token: string; // Define your session properties here
    // Add other session properties as needed
  }
}
