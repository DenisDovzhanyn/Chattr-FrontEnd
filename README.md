# Chattr Frontend

The Chattr Frontend is the client-facing interface for the Chattr application, designed to provide users with a seamless and responsive experience for real-time messaging and chat management.
This frontend interacts with the Chattr API, WebSocket Connections, and Message Queue Worker services to deliver core functionality.

## Features

- **User Authentication**
  - Login and signup interfaces with secure token handling using JWT.
  - Support for login via one-time key for password recovery.

- **Chat Management**
  - View chat lists, create new chats, and manage chat memberships.
  - Retrieve old messages and participate in real-time conversations.

- **Message Handling**
  - Send and receive real-time messages via WebSocket connections.
  - Retrieve offline messages stored in the database.

- **Encryption Key Management**
  - Handle encryption keys securely for end-to-end encrypted conversations.

- **Responsive UI**
  - Optimized for various devices, including desktops, tablets, and mobile devices.

## Tech Stack

- **React**: A modern JavaScript library for building user interfaces.
- **TypeScript**: Provides static typing for better maintainability and scalability.
- **WebSocket**: For real-time communication with the backend.

## Integration Points

### Chattr API
The frontend communicates with the Chattr API to handle:
- User authentication (signup, login, and token management).
- Chat creation and user management within chats.
- Fetching historical messages and chat lists.
- Managing encryption keys for chats.

### WebSocket Connections
The frontend establishes a WebSocket connection to:
- Subscribe to chats for receiving real-time messages.
- Send messages to the backend for processing.

### Message Queue Worker
Indirectly interacts via the WebSocket service to:
- Ensure all sent messages are validated, stored, and broadcasted.
