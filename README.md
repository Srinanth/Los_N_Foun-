# 🔍 Lost & Found Platform  

A **smart AI-powered lost and found platform** that helps users report, search, and match lost and found items based on **location and description**.
**Built as part of the IPR Project for Semester 2** – This project showcases the integration of AI and modern web technologies to solve real-world problems.
## 🚀 Features  

✅ **Report Lost & Found Items** – Users can report lost or found items with details like category, description, location, and optional images.  
✅ **AI-Powered Matchmaking** – Uses a Hugging Face model to intelligently match lost and found items based on descriptions and locations.  
✅ **Location-Based Search** – Users can search for lost or found items within their area.  
✅ **Email Contact System** – Users can click on a lost or found report and directly send an email to the reporter for inquiries.  
✅ **User Authentication** – Firebase-based authentication with **email and Google sign-up options**.  
✅ **Modern & Responsive UI** – Built with **Tailwind CSS** for a seamless mobile-friendly experience.  

## 🛠️ Tech Stack  

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Express.js, Node.js  
- **AI Model:** Hugging Face  
- **Database & Authentication:** Firebase (Firestore & Auth)  

## 🏗️ Setup Instructions  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/yourusername/lost-and-found.git
cd lost-and-found
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Set Up Firebase  
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)  
- Enable **Firestore Database** & **Authentication**  
- Get Firebase config keys and update `firebase.js`  

### 4️⃣ Start the Backend Server  
```bash
cd server
node server.js
```

### 5️⃣ Run the Frontend  
```bash
npm run dev
```

## 🎯 Usage  

### 1️⃣ Report Lost or Found Items  
- Navigate to the **"Report Item"** or **"Report a Found Item"** page.  
- Enter details like **category, description, and location**.  
- Optionally upload an **image**.  

### 2️⃣ Search & AI-Powered Matchmaking  
- Use the **location-based search** to find items within your area.  
- AI matches lost and found items based on **description & location**.  

### 3️⃣ Contact Users  
- Click on an item report to view details.  
- Use the **email button** to contact the owner directly.  

---

## 📌 Future Enhancements  

- **Push notifications** for matching items  
- **Image-based AI matching** for better accuracy  
- **Multi-language support** for wider accessibility  

---

Contributions & feedback are welcome! 🚀
