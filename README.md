# BioCrats (Biocrats Club IIT Indore)



## About


BioCrats is the official club website of Biocrats Club, IIT Indore — a digital hub for all club-related activities, announcements, events, and resources.
It serves as a one-stop platform for students, faculty, and enthusiasts connected to the world of biology and biotechnology at IIT Indore.

🔗 Live Website: http://biocrats.vercel.app

---

##  Features

- Landing page with club overview
- Events page (dynamic from backend)
- Team/Faculty details
- Gallery for images
-  Responsive design
-  Full-stack project (Backend + Frontend)

---

## 🛠 Tech Stack

- **Frontend**: React (with Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (frontend), Node server deployable anywhere (backend)

---

## 🗂 Architecture & Folder Structure

Bio-Crats/
├── Backend/
│ ├── node_modules/
│ ├── uploads/ # uploaded files/images
│ ├── .env # environment variables
│ ├── Events.js # events data / schema
│ ├── server.js # express server entry point
│ ├── package.json
│ └── package-lock.json
│
├── Frontend/
│ ├── node_modules/
│ ├── public/
│ │ └── core/logo.png
│ ├── src/
│ │ ├── assets/ # images, faculty, event assets
│ │ ├── components/
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.css
│ │ └── main.jsx
│ ├── index.html
│ ├── eslint.config.js
│ ├── package.json
│ └── vite.config.js
│
└── README.md


## ⚙️ Local Setup

Clone the repository

    git clone https://github.com/BioCrats-Club-IIT-Indore/Bio-Crats.git
    cd Bio-Crats

2. Backend Setup
    ```bash
    cd Backend
    npm install


Create a .env file (refer to .env.example):

    PORT=5000
    MONGO_URI=<your_mongo_db_url>


Run backend:

    npm run dev


Server will start at  Backend_Url/

3. Frontend Setup

        cd ../Frontend
        npm install


Run frontend:

     npm run dev


Frontend runs on http://localhost:5173/ (Vite default).



## 📬 Contact

🌐 Website – http://biocrats.vercel.app

💻 GitHub – [http://BioCrats-Club-IIT-Indore](https://github.com/BioCrats-Club-IIT-Indore/Bio-Crats.git)

Developer –  Anand Vivek
