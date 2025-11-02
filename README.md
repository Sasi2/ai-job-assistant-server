
# 🧠 AI Job Assistant

This is one of my full-stack projects, a web app I built to help users improve their **resumes** and **cover letters**. It uses OpenAI's GPT model to analyze the documents against a specific **job description**.

---

## 🚀 Features

* Upload your **resume** and **cover letter** (in text format)
* Paste a **job description**
* Get **AI-powered suggestions** to improve wording, relevance, and impact
* Simple React frontend + Express backend
* Beginner-friendly setup (no heavy frameworks)

---

## 🗂️ Project Structure

This project is a monorepo with separate `client` and `server` folders.

```

job-assistant/
├── client/           \# React frontend
│   ├── src/
│   │   ├── App.js    \# Main UI logic
│   │   └── index.js  \# React entry point
│   └── package.json
└── server/           \# Express backend
├── index.js      \# API routes
└── package.json

````

---

## 🧩 The Tech Stack I Used

* **Frontend:** React, Axios
* **Backend:** Node.js, Express, Multer (for file handling)
* **AI:** OpenAI API (GPT-4o-mini)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone [https://github.com/](https://github.com/)<your-username>/job-assistant.git
cd job-assistant
````

### 2\. Backend Setup

```bash
cd server
npm install
```

Create a file named `.env` in the `server` folder and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

Then start the backend:

```bash
node index.js
```

The server will run at `http://localhost:3000`.

### 3\. Frontend Setup

Open a **new terminal** and run:

```bash
cd client
npm install
npm start
```

This will start the React app on `http://localhost:3001` (or the next available port).

-----

## 💡 How It Works

1.  The user enters a job description and uploads their resume/cover letter on the React frontend.
2.  The app sends these files and the text to my Express backend.
3.  The backend server then securely calls the OpenAI API with a prompt I engineered, asking it to analyze the documents in the context of the job description.
4.  Finally, the server streams the AI's improvement suggestions back to the frontend to display to the user.

-----

## 🌐 Deployment Options

  * **Frontend:** GitHub Pages / Vercel / Netlify
  * **Backend:** Render / Railway / Heroku
  * (Remember to use environment variables to securely store your API key in deployment.)

-----

## 📝 My Plans for Future Enhancements

  * Add text extraction for PDFs and DOCX files.
  * Include an option to auto-rewrite resume bullets.
  * Allow users to save personalized job/resume versions.
  * Style the UI with Tailwind CSS.

-----

## 👨‍💻 About Me

  * **Veera Saideep Sasank Vulavakayala (Sasi)**
  * Undergraduate in Computer Science and Engineering @ university of South Florida
  * Built with ❤️ using React + Node.js

## 📜 License

This project is open source under the MIT License.

```
```
The server will run at http://localhost:3000.

3. Frontend Setup
Open a new terminal and run:

Bash

cd client
npm install
npm start
This will start the React app on http://localhost:3001 (or the next available port).

💡 How It Works
The user enters a job description and uploads their resume/cover letter on the React frontend.

The app sends these files and the text to my Express backend.

The backend server then securely calls the OpenAI API with a prompt I engineered, asking it to analyze the documents in the context of the job description.

Finally, the server streams the AI's improvement suggestions back to the frontend to display to the user.

🌐 Deployment Options
Frontend: GitHub Pages / Vercel / Netlify

Backend: Render / Railway / Heroku

(Remember to use environment variables to securely store your API key in deployment.)

📝 My Plans for Future Enhancements
Add text extraction for PDFs and DOCX files.

Include an option to auto-rewrite resume bullets.

Allow users to save personalized job/resume versions.

Style the UI with Tailwind CSS.

👨‍💻 About Me
Veera Saideep Sasank Vulavakayala (Sasi)

Undergraduate in Computer Science and Engineering @ university of South Florida

Built using React + Node.js

📜 License
This project is open source under the MIT License.
