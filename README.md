# AI Code Reviewer Web App 🤖
A simple yet powerful web application that provides instant, AI-powered code reviews. Paste your code into the web interface and receive constructive feedback on potential bugs, performance issues, and best practices from Google's Gemini Pro model.

## 📖 Table of Contents
- About The Project

- Key Features

- Built With

- Getting Started

- Prerequisites

- Installation

- Configuration

- API Endpoint Documentation

- Project Architecture

- Prompt Engineering

- Contributing

## 📖 About The Project
In modern software development, code reviews are essential for maintaining quality, but they can be time-consuming. This project aims to bridge that gap by providing an automated "first pass" review. It allows developers and students to get immediate, intelligent feedback on code snippets without waiting for a human reviewer.

The application is built to be simple, efficient, and easy to understand. The user pastes their code into a web interface, and the backend communicates with the Google Gemini API to generate a comprehensive review focusing on bugs, performance, and best practices.


## ✨ Key Features
- **Dynamic Frontend**: A lightweight, responsive, and fast user interface built with vanilla JavaScript, HTML5, and CSS3. No heavy frameworks are needed.

- **Robust Backend API**: A scalable RESTful API built with Node.js and the Express.js framework, providing a clear and stable endpoint for code analysis.

- **State-of-the-Art AI Integration**: Utilizes the Google Gemini Pro model for nuanced and context-aware code analysis, going beyond simple linting.

- **Secure by Design**: Follows security best practices by using environment variables (.env) to manage the sensitive Gemini API key, preventing it from being exposed in the source code.

- **User-Friendly Interface**: A clean, minimalist UI/UX that is intuitive and requires no setup for the end-user.

- **Interactive Web UI**: A clean and simple interface to paste code and view feedback directly in your browser.

- **Instant Analysis**: Leverages the power of the Google Gemini Pro API to get real-time code analysis without any setup or configuration.

- **Quality-Focused Feedback**: The AI is specifically prompted to act as an expert code reviewer, focusing on high-impact suggestions rather than minor style preferences.

- **Simple & Secure Architecture**: Built with a standard Node.js backend and a static frontend, using environment variables to keep your API keys safe.

## 🛠️ Tech Stack
**This project leverages a modern and widely-used tech stack.**

***Frontend***
- **HTML5**: Standard markup language for creating the web page structure.

- **CSS3**: Styling language for designing the user interface.

- **Vanilla JavaScript**: Used for all client-side logic, including DOM manipulation and API requests (fetch).

***Backend***
- **Node.js**: A JavaScript runtime for building the server-side application.

- **Express.js**: A minimal and flexible Node.js web application framework.

- **@google/generative-ai**: The official Google client library for the Gemini API.

- **dotenv**: A zero-dependency module that loads environment variables from a .env file.

***AI***
- Google Gemini Pro API


## ⚙️ Configuration
The application requires the following environment variable to be set in the .env file:

- **GEMINI_API_KEY**: This is your secret key for authenticating with the Google Gemini API. The application will not work without it.


## 🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.


## 📂 Project Architecture
**The application uses a classic client-server architecture.**
```
web-code-reviewer/
├── public/              # Client-Side: All files sent to the user's browser
│   ├── index.html       # The application's HTML skeleton (the DOM)
│   ├── style.css        # The visual presentation layer (the UI/UX)
│   └── script.js        # The client-side controller (handles user interaction)
├── .env                 # Configuration: Securely stores secret API keys
├── .gitignore           # Git Config: Specifies files to be ignored by version control
├── package.json         # Project Manifest: Defines dependencies and project metadata
└── server.js            # Server-Side: The application's backend logic and API
Entry point
```

- **Client (Browser)**: The user interacts with the index.html file. The script.js file handles capturing the input and making a fetch request to the backend.

- **Server (Node.js/Express)**: The server.js file runs an Express server that listens for incoming requests on port 3000.

- **Data Flow**:
User Input -> Frontend (script.js) -> HTTP POST Request -> Backend (server.js) -> Gemini API Request -> Gemini API Response -> Backend (server.js) -> HTTP Response -> Frontend (script.js) -> Display on Page


## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
