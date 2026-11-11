# VitalPlast MAIN EVENT — Expo Go demo

An Expo Go mobile companion to the existing desktop/web prototype. The web app in the project root remains unchanged.

## Run on a phone with Expo Go

1. Install Node.js LTS on the development computer and install Expo Go on the phone.
2. In a terminal, open this `mobile-expo` folder and install dependencies:

   ```bash
   npm install
   ```

3. Start an Expo tunnel:

   ```bash
   npx expo start --tunnel
   ```

   Or use the package script: `npm run start:tunnel`.
4. Keep the terminal and tunnel running. Scan the QR code in the terminal with Expo Go on Android. On iPhone, scan it with the Camera app and open the link in Expo Go. If asked, allow Expo Go to open the project.
5. Expo CLI also prints a link beginning with `exp://` (or an Expo development URL). Use the live link from that running session; it is temporary and changes when the server restarts.

Both the computer and phone need internet access for a tunnel. The Expo Go QR code is for this mobile project, not the desktop web page.

## Demo scope

This is a presentation prototype with sample data. It demonstrates the mobile feed, filters and likes, client list, a local client chat, adding a sample client, and the Help/ARTEMIS/JARVIS/OPENVIKING assistant concepts. It does not connect those demo interactions to the root project's Express API or deliver messages to other users. Configure a reachable HTTPS backend separately for live, shared data.
