<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>Spendie: Smart Expense Tracking</h1>
  <p>An elegant and user-friendly full-stack web application designed to help you take control of your personal finances. Spendie allows you to track daily expenses, set monthly budgets, and visualize your spending habits with a dynamic dashboard.</p>
  <h2>✨ Features</h2>
  <ul>
    <li><strong>User Authentication</strong>: Secure registration and login using JSON Web Tokens (JWT).</li>
    <li><strong>Onboarding</strong>: A personalized setup for new users to define their payment methods and expense categories.</li>
    <li><strong>Dynamic Dashboard</strong>: A central hub that visualizes your total spending, budget vs. actuals, and transaction history.</li>
    <li><strong>Budget Management</strong>: Set and track monthly budgets for each of your custom expense categories.</li>
    <li><strong>Daily Expense Logging</strong>: An easy-to-use form to log your daily spending.</li>
  </ul>
  <h2>🚀 Tech Stack</h2>
  <p>Spendie is a full-stack application built with the MERN stack.</p>
  <h3>Backend</h3>
  <ul>
    <li><strong>Node.js</strong>: The server-side JavaScript runtime.</li>
    <li><strong>Express.js</strong>: The web application framework for the API.</li>
    <li><strong>MongoDB</strong>: A NoSQL database for flexible data storage.</li>
    <li><strong>Mongoose</strong>: An object data modeling (ODM) library for MongoDB.</li>
    <li><strong>JWT &amp; bcrypt.js</strong>: For secure user authentication and password hashing.</li>
  </ul>
  <h3>Frontend</h3>
  <ul>
    <li><strong>React.js</strong>: The library for building the user interface.</li>
    <li><strong>Vite</strong>: The build tool for a fast development experience.</li>
    <li><strong>TypeScript</strong>: A superset of JavaScript for type safety.</li>
    <li><strong>Axios</strong>: For making HTTP requests to the backend API.</li>
    <li><strong>React Router</strong>: For client-side navigation.</li>
    <li><strong>Shadcn/UI</strong>: The component library for a modern and accessible design.</li>
  </ul>
  <h2>⚙️ Getting Started</h2>
  <p>Follow these steps to get a local copy of the project up and running.</p>
  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (LTS version)</li>
    <li>MongoDB Atlas account</li>
    <li>Git</li>
  </ul>
  <h3>Installation</h3>
  <ol>
    <li><strong>Clone the repository:</strong>
      <pre><code>git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name</code></pre>
    </li>
    <li><strong>Backend Setup:</strong>
      <p>Navigate into the backend folder and install the dependencies.</p>
      <pre><code>cd Spendie_backend
npm install</code></pre>
      <p>Create a <code>.env</code> file with your database connection string and a JWT secret:</p>
      <pre><code>ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key</code></pre>
    </li>
    <li><strong>Frontend Setup:</strong>
      <p>Navigate into the frontend folder and install the dependencies.</p>
      <pre><code>cd ../Spendie_frontend
npm install</code></pre>
    </li>
  </ol>
  <h3>Running the Application</h3>
  <p>Open two separate terminal windows.</p>
  <ol>
    <li><strong>Run the Backend Server:</strong>
      <pre><code>cd Spendie_backend
node server.js</code></pre>
    </li>
    <li><strong>Run the Frontend Development Server:</strong>
      <pre><code>cd ../Spendie_frontend
npm run dev</code></pre>
    </li>
  </ol>
  <p>The application will be accessible at <code>http://localhost:8080</code>.</p>
  <h2>📂 Project Structure</h2>
  <pre><code>.
├── Spendie_backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── tempCodeRunnerFile.js
└── Spendie_frontend/
    ├── src/
    ├── public/
    ├── bun.lockb
    ├── components.json
	├── eslint.config.js
    ├── index.html
    ├── package-lock.json
	├── package2.json
    ├── postcss.config.js
    ├── tailwind.config.ts
	├── tsconfig.app.json
    ├── tsconfig.json
  	├── tsconfig.node.json
    └── vite.config.ts
</code></pre>
  <h2>🙏 Contributing</h2>
  <p>Feel free to contribute to this project. For major changes, please open an issue first to discuss what you would like to change.</p>
</body>
</html>
