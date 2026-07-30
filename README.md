# 🌸 BloomHer

**Empowering Women Through Menstrual & PCOS Management**

BloomHer is a comprehensive digital health platform designed to help women understand, track, and manage their menstrual cycles and PCOS symptoms. With AI-powered predictions, personalized insights, and a supportive community, BloomHer makes women's health management simple, intuitive, and empowering.

![BloomHer Platform](images/img1.webp)

---

## ✨ Key Features

- 🩸 **Advanced Period Tracking** - Smart calendar with cycle predictions and symptom logging
- 🔄 **PCOS Management** - Specialized tools for managing PCOS symptoms and hormonal health
- 📊 **Cycle Analytics** - Detailed insights into your cycle patterns and health trends
- 🥗 **Nutrition Guidance** - Personalized meal tracking and diet recommendations by cycle phase
- 💪 **Exercise Plans** - Phase-specific workout routines optimized for hormonal balance
- 😴 **Sleep Monitoring** - Track and improve sleep quality throughout your cycle
- 🧘 **Stress Management** - Mindfulness tools and stress-reduction techniques
- 👩‍⚕️ **Expert Consultation** - Connect with healthcare professionals
- 👥 **Community Support** - Safe space to share experiences and get support
- 📝 **Educational Blog** - Evidence-based articles on women's health
- 🛍️ **Wellness Shop** - Curated products for menstrual and PCOS care
- 🤖 **Maya AI Assistant** - BloomHer's in-app health assistant for cycle, PCOS, and wellness guidance

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Modern responsive styling
- **Vanilla JavaScript** - Client-side interactivity
- **Lucide Icons** - Beautiful, consistent iconography
- **BloomHer Maya Assistant** - First-party health assistant widget
- **Gemini API** - Optional backend-powered AI responses when `GEMINI_API_KEY` is set

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling

### Development Tools
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing middleware
- **nodemon** - Auto-restart during development

---

## 📁 Project Structure

```
BloomHer/
│
├── index.html                    # Landing page
├── server.js                     # Main backend server
├── package.json                  # Root dependencies
│
├── bloomher-backend/            # Backend application
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── routes/             # API route handlers
│   │   │   └── index.js
│   │   ├── controllers/        # Business logic layer
│   │   │   └── index.js
│   │   ├── models/             # MongoDB schemas
│   │   │   └── index.js
│   │   └── services/           # External services & utilities
│   │       └── index.js
│   ├── package.json            # Backend dependencies
│   └── README.md               # Backend documentation
│
├── mainpages/                   # HTML pages for features
│   ├── tracker.html            # Period tracking calendar
│   ├── diet.html               # Nutrition & meal tracking
│   ├── exercises.html          # Exercise recommendations
│   ├── sleep.html              # Sleep cycle monitoring
│   ├── stress.html             # Stress management tools
│   ├── expert.html             # Expert consultation
│   ├── community.html          # Community forum
│   ├── blog.html               # Health articles
│   ├── shop.html               # Wellness products
│   ├── contactus.html          # Contact form
│   └── log.html                # User account/login
│
├── scriptpages/                 # JavaScript modules
│   ├── mainscript.js           # Landing page scripts
│   ├── tracker.js              # Tracking functionality
│   ├── diet.js                 # Diet tracking logic
│   ├── exercises.js            # Exercise tracking
│   ├── sleep.js                # Sleep monitoring
│   ├── stress.js               # Stress management
│   ├── expert.js               # Expert consultation
│   ├── community.js            # Community interactions
│   ├── blog.js                 # Blog functionality
│   ├── shop.js                 # Shopping cart logic
│   ├── contact.js              # Contact form handling
│   └── log.js                  # Authentication logic
│
├── stylepages/                  # CSS stylesheets
│   ├── mainstyle.css           # Global & landing styles
│   ├── tracker.css             # Tracker page styles
│   ├── diet.css                # Diet page styles
│   ├── exercises.css           # Exercise page styles
│   ├── sleep.css               # Sleep page styles
│   ├── stress.css              # Stress page styles
│   ├── expert.css              # Expert page styles
│   ├── community.css           # Community page styles
│   ├── blog.css                # Blog page styles
│   ├── shop.css                # Shop page styles
│   ├── contact.css             # Contact page styles
│   └── log.css                 # Login/account styles
│
├── images/                      # Image assets
│   └── img1.webp               # Hero image & graphics
│
└── sounds/                      # Audio files (e.g., notifications)
```

### Architecture Overview

**Frontend → Backend → Database**

1. **User Interface Layer** (HTML/CSS/JS)
   - Users interact with responsive web pages
   - JavaScript handles client-side validation and interactivity
   - LocalStorage for temporary data persistence

2. **API Layer** (Express.js)
   - RESTful endpoints handle CRUD operations
   - Middleware for authentication, validation, and error handling
   - Routes organized by feature domain

3. **Business Logic Layer** (Controllers/Services)
   - Controllers process API requests
   - Services handle complex business rules
   - Data validation and sanitization

4. **Data Layer** (MongoDB/Mongoose)
   - Mongoose schemas define data structure
   - MongoDB stores user data, logs, and content
   - Indexed queries for performance

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account) - [Setup Guide](https://www.mongodb.com/docs/manual/installation/)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/noobremon/BloomHer.git
cd BloomHer
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd bloomher-backend
npm install
cd ..
```

### Step 4: Environment Configuration

Create a `.env` file in the **root directory**:

```env
# MongoDB Connection
ATLAS_URI=mongodb://localhost:27017/bloomher
# OR use MongoDB Atlas
# ATLAS_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bloomher?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Session & Auth (if implementing)
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_here

# Optional: Email Service (for notifications)
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password

# Optional: Maya Assistant Configuration
GEMINI_API_KEY=your_gemini_api_key_here
# Optional: choose a Gemini model
GEMINI_MODEL=gemini-1.5-flash
```

Create a `.env` file in the **bloomher-backend** directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bloomher
# OR use MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bloomher?retryWrites=true&w=majority

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

> **Security Note**: Never commit `.env` files to version control. Add them to `.gitignore`.

---

## 🖥️ Running the Application Locally

### Option 1: Run Both Frontend & Backend Together

**Terminal 1 - Backend Server:**
```bash
# From root directory
node server.js
```

Expected output:
```
Server is running on port: 5000
MongoDB database connection established successfully
```

**Terminal 2 - Frontend Development:**
```bash
# Serve frontend with a simple HTTP server
npx http-server -p 3000
```

Visit: **http://localhost:3000**

### Option 2: Run Backend Only (Alternative Structure)

```bash
cd bloomher-backend
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Testing the API

You can test the backend API using tools like:
- **Postman** - [Download](https://www.postman.com/)
- **curl** - Command line
- **Thunder Client** - VS Code extension

Example API test:
```bash
curl http://localhost:5000/users
```

---

## 🏗️ Build & Deployment

### Production Build

1. **Optimize Frontend Assets:**
```bash
# Minify CSS
npx clean-css-cli stylepages/*.css -o dist/styles.min.css

# Minify JavaScript
npx uglify-js scriptpages/*.js -o dist/scripts.min.js
```

2. **Set Production Environment:**
```env
NODE_ENV=production
```

### Deployment Options

#### Option 1: Vercel (Frontend)

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option 2: Heroku (Full Stack)

```bash
# Install Heroku CLI
heroku login
heroku create bloomher-app

# Set environment variables
heroku config:set ATLAS_URI=your_mongodb_uri
heroku config:set PORT=5000

# Deploy
git push heroku main
```

#### Option 3: Render (Recommended)

1. Connect your GitHub repository to [Render](https://render.com/)
2. Create a **Web Service** for the backend
3. Create a **Static Site** for the frontend
4. Set environment variables in Render dashboard
5. Deploy automatically on git push

#### Option 4: AWS / DigitalOcean / Azure

- Use **PM2** for process management:
```bash
npm install -g pm2
pm2 start server.js --name bloomher
pm2 startup
pm2 save
```

- Set up **Nginx** as reverse proxy
- Configure **SSL certificates** with Let's Encrypt

### Environment Variables for Production

Ensure these are set on your hosting platform:
- `ATLAS_URI` or `MONGODB_URI`
- `PORT`
- `NODE_ENV=production`
- `JWT_SECRET` (if using authentication)

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| **GET** | `/users` | Get all users | - |
| **POST** | `/users/add` | Add new user | `{ "username": "string" }` |
| **GET** | `/tracker` | Get tracker data | - |
| **POST** | `/tracker/add` | Log period data | `{ "userId": "string", "date": "date", "flow": "string", "symptoms": ["array"] }` |
| **GET** | `/diet` | Get diet logs | - |
| **POST** | `/diet/add` | Log meal | `{ "userId": "string", "food": "string", "calories": "number", "time": "string" }` |
| **GET** | `/exercises` | Get exercise data | - |
| **POST** | `/exercises/add` | Log workout | `{ "userId": "string", "exercise": "string", "duration": "number" }` |
| **GET** | `/sleep` | Get sleep logs | - |
| **POST** | `/sleep/add` | Log sleep | `{ "userId": "string", "duration": "number", "quality": "string" }` |
| **GET** | `/stress` | Get stress logs | - |
| **POST** | `/stress/add` | Log stress level | `{ "userId": "string", "level": "string", "activities": ["array"] }` |
| **GET** | `/expert` | Get expert consultations | - |
| **POST** | `/expert/book` | Book consultation | `{ "userId": "string", "expertId": "string", "date": "date" }` |
| **GET** | `/community` | Get community posts | - |
| **POST** | `/community/post` | Create post | `{ "userId": "string", "content": "string", "title": "string" }` |

### Example API Request

**POST** `/users/add`
```json
{
  "username": "jane_doe"
}
```

**Response** (200 OK):
```json
{
  "message": "User added!",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

## 💡 Usage Examples

### 1. Period Tracking

1. Navigate to **Tracker** page
2. Enter your first period date (one-time setup)
3. Click on calendar dates to log daily information:
   - Flow intensity (light, medium, heavy)
   - Symptoms (cramps, headache, mood changes)
   - Activities and notes
4. View cycle predictions and patterns

### 2. Diet Management

1. Go to **Diet** page
2. View your current cycle phase recommendations
3. Log meals with:
   - Food name
   - Calorie count
   - Time consumed
4. See daily nutrition summary
5. Get phase-specific food suggestions

### 3. Exercise Tracking

1. Visit **Exercises** page
2. Choose exercises based on your cycle phase:
   - **Menstrual**: Gentle yoga, walking
   - **Follicular**: Cardio, HIIT
   - **Ovulation**: Strength training
   - **Luteal**: Moderate intensity
3. Log workout duration and intensity
4. Track progress over time

### 4. Community Engagement

1. Open **Community** page
2. Browse posts from other users
3. Share your experiences anonymously
4. Support others and get advice
5. Participate in discussions

---

## 📸 Screenshots

> **Note**: Add screenshots of your application here to showcase the user interface

### Landing Page
![Landing Page](./screenshots/landing.png)

### Period Tracker
![Period Tracker](./screenshots/tracker.png)

### Diet Planner
![Diet Planner](./screenshots/diet.png)

### Community Forum
![Community](./screenshots/community.png)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/BloomHer.git
   cd BloomHer
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments where necessary
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: amazing new feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes in detail
   - Submit for review

### Contribution Guidelines

- **Code Quality**: Write clean, maintainable code
- **Documentation**: Update README if you add features
- **Testing**: Test your changes before submitting
- **Commit Messages**: Use clear, descriptive commit messages
  - `Add:` for new features
  - `Fix:` for bug fixes
  - `Update:` for improvements
  - `Remove:` for deletions
- **Issue First**: For major changes, open an issue first to discuss

### Areas We Need Help

- 🐛 Bug fixes and testing
- 🎨 UI/UX improvements
- 📱 Mobile responsiveness enhancements
- 🌐 Internationalization (translations)
- ♿ Accessibility improvements
- 📚 Documentation and tutorials
- 🔒 Security audits
- ⚡ Performance optimizations

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
Copyright (c) 2026 BloomHer Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🚀 Future Improvements & Roadmap

### Version 2.0 (Q2 2026)

- [ ] **User Authentication System**
  - Email/password registration
  - OAuth integration (Google, Facebook)
  - Password reset functionality
  - Email verification

- [ ] **Mobile Application**
  - React Native iOS app
  - React Native Android app
  - Push notifications for cycle reminders
  - Offline mode support

- [ ] **Advanced Analytics**
  - Machine learning cycle predictions
  - Symptom correlation analysis
  - Personalized health insights
  - Export data as PDF reports

### Version 2.1 (Q3 2026)

- [ ] **Enhanced Features**
  - Medication reminders
  - Supplement tracking
  - Water intake monitoring
  - Mood journaling with AI sentiment analysis

- [ ] **Social Features**
  - Private messaging between users
  - Expert Q&A sessions
  - Live webinars and workshops
  - User badges and achievements

### Version 3.0 (Q4 2026)

- [ ] **Professional Tools**
  - Healthcare provider dashboard
  - Telemedicine integration
  - Lab results integration
  - Prescription management

- [ ] **Wearable Integration**
  - Apple Watch sync
  - Fitbit integration
  - Oura Ring compatibility
  - Automatic sleep/activity tracking

- [ ] **Advanced PCOS Features**
  - Insulin resistance tracking
  - Ovulation prediction kits integration
  - Fertility tracking and insights
  - Customized PCOS meal plans

### Long-term Vision

- 🌍 **Multi-language Support** - Reach global audience
- 🤖 **AI Health Assistant** - Personalized chatbot advice
- 🔬 **Research Collaboration** - Contribute to women's health research
- 🏥 **Insurance Integration** - Connect with health insurance providers
- 📊 **Data Analytics Platform** - Anonymous data for medical research
- 🌱 **Holistic Wellness** - Integrate mental health and therapy resources

### Community Suggestions

Have an idea? [Open an issue](https://github.com/noobremon/BloomHer/issues) with the tag `feature-request` and let's discuss!

---

## 📞 Support & Contact

### Get Help

- 📧 **Email**: support@bloomher.com
- 💬 **Discord**: [Join our community](https://discord.gg/bloomher)
- 🐦 **Twitter**: [@BloomHerApp](https://twitter.com/bloomherapp)
- 📱 **Instagram**: [@bloomher_official](https://instagram.com/bloomher_official)
- 🌐 **Website**: [www.bloomher.com](https://www.bloomher.com)

### Report Bugs

Found a bug? Please [open an issue](https://github.com/noobremon/BloomHer/issues) with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

### Feature Requests

Have a suggestion? [Open a feature request](https://github.com/noobremon/BloomHer/issues/new?template=feature_request.md)

---

## 🙏 Acknowledgments

- **Lucide Icons** - Beautiful icon set
- **BloomHer Maya Assistant** - Embedded women's health assistant
- **MongoDB** - Database solution
- **Express.js Community** - Web framework
- **All Contributors** - Thank you for making BloomHer better

### Special Thanks

- Healthcare professionals who provided medical guidance
- Beta testers who gave valuable feedback
- Open source community for tools and libraries
- Women who shared their experiences to shape this platform

---

## ⚠️ Disclaimer

BloomHer is designed as an educational and tracking tool. It is **NOT a substitute for professional medical advice, diagnosis, or treatment**. Always consult with qualified healthcare providers regarding any health concerns or before making medical decisions.

If you experience severe symptoms, irregular cycles, or concerning health changes, please seek immediate medical attention.

---

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/noobremon/BloomHer?style=social)
![GitHub forks](https://img.shields.io/github/forks/noobremon/BloomHer?style=social)
![GitHub issues](https://img.shields.io/github/issues/noobremon/BloomHer)
![GitHub pull requests](https://img.shields.io/github/issues-pr/noobremon/BloomHer)
![License](https://img.shields.io/github/license/noobremon/BloomHer)

---

<div align="center">

**Made with 💖 for women's health and wellness**

⭐ **Star this repo** if you find it helpful! ⭐

[Report Bug](https://github.com/noobremon/BloomHer/issues) · [Request Feature](https://github.com/noobremon/BloomHer/issues) · [Documentation](https://github.com/noobremon/BloomHer/wiki)

</div>
