<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
# 🎭 ClubManager - Professional Club Management System

A complete, production-ready club management web application with role-based access control, persistent data storage, and a beautiful responsive UI.

## 🚀 Live Demo

**Website:** https://aryan788715-netizen.github.io/clubmanager-app/

## ✨ Features

### 🔐 Three User Roles

#### 👑 Owner (Super Admin)
- Full system control
- Enable/disable maintenance mode
- Customize club name and description
- Manage admins (add/remove)
- View all events, bookings, and users
- Complete analytics dashboard

#### 👨‍💼 Admin
- Create, edit, and delete events
- Set event pricing and capacity
- View all bookings and payments
- Send in-app notifications to users
- Analytics dashboard

#### 👤 User
- View all available events with pricing
- Book events with guest count
- View booking history
- Receive notifications
- See event details (date, time, venue, capacity)

### 💾 Data Persistence
- LocalStorage-based JSON database
- Persistent across sessions
- Automatic data initialization
- Real-time updates

### 🎨 UI/UX Features
- Modern, responsive design
- Smooth animations and transitions
- Mobile-friendly interface
- Role-based dashboards
- Real-time statistics
- Beautiful gradient themes

### 🔧 System Features
- Maintenance mode (blocks users/admins)
- Role-based access control
- Session management
- Event capacity tracking
- Booking management
- Notification system

## 🔑 Demo Accounts

### Owner Account
- **Email:** owner@club.com
- **Password:** owner123
- **Access:** Full system control

### Admin Account
- **Email:** admin@club.com
- **Password:** admin123
- **Access:** Event and booking management

### User Account
- **Email:** user@club.com
- **Password:** user123
- **Access:** View events and make bookings

## 📦 Installation & Setup

### Option 1: Live Demo (Recommended)
Simply visit: https://aryan788715-netizen.github.io/clubmanager-app/

### Option 2: Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/aryan788715-netizen/clubmanager-app.git
cd clubmanager-app
```

2. **Open in browser:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or simply open index.html in your browser
```

3. **Access the application:**
```
http://localhost:8000
```

### Option 3: Deploy Your Own

1. Fork the repository
2. Enable GitHub Pages in repository settings
3. Your app will be live at: `https://YOUR-USERNAME.github.io/clubmanager-app/`

## 📁 Project Structure

```
clubmanager-app/
├── index.html          # Main HTML file with UI
├── app.js             # Complete application logic
├── README.md          # This file
└── .gitignore         # Git ignore file
```

## 🎯 How to Use

### As Owner:
1. Login with owner credentials
2. Navigate to "Maintenance" to enable/disable system
3. Go to "Manage Admins" to add/remove admins
4. Use "Customize" to change club name/description
5. View all events, bookings, and users
6. Full control over the system

### As Admin:
1. Login with admin credentials
2. Navigate to "Events" to create/edit events
3. Set pricing, capacity, date, time, and venue
4. View all bookings in "Bookings" section
5. Send notifications to users
6. Monitor analytics dashboard

### As User:
1. Login with user credentials
2. Browse available events
3. Click "Book Now" to make a booking
4. Select number of guests
5. View booking confirmation
6. Check "My Bookings" for history
7. Receive notifications

## 🔧 Technical Details

### Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Storage:** LocalStorage (JSON-based)
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Unicode Emojis
- **Fonts:** Google Fonts (Inter)

### Database Schema

#### Users
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  role: 'owner' | 'admin' | 'user'
}
```

#### Events
```javascript
{
  id: string,
  title: string,
  description: string,
  date: string,
  time: string,
  price: number,
  capacity: number,
  venue: string,
  booked: number,
  createdAt: string
}
```

#### Bookings
```javascript
{
  id: string,
  userId: string,
  eventId: string,
  guests: number,
  totalAmount: number,
  bookingDate: string
}
```

#### Notifications
```javascript
{
  id: string,
  title: string,
  message: string,
  date: string
}
```

#### Settings
```javascript
{
  clubName: string,
  clubDescription: string,
  maintenanceMode: boolean,
  maintenanceMessage: string
}
```

## 🎨 Customization

### Change Colors
Edit CSS variables in `index.html`:
```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --success: #10b981;
    --danger: #ef4444;
    /* ... more colors */
}
```

### Add New Features
1. Update database schema in `app.js`
2. Add UI components in `index.html`
3. Implement logic in `app.js`

## 🔒 Security Notes

**⚠️ Important:** This is a demo application using client-side storage.

For production use:
- Implement proper backend authentication
- Use secure password hashing (bcrypt)
- Add JWT tokens for sessions
- Use a real database (PostgreSQL, MongoDB)
- Implement HTTPS
- Add input validation and sanitization
- Implement rate limiting
- Add CSRF protection

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🐛 Known Limitations

1. Data stored in LocalStorage (browser-specific)
2. No real payment processing
3. Client-side authentication (demo only)
4. No email notifications
5. Single-browser persistence

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Real payment gateway
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Export reports (PDF/Excel)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Calendar view for events
- [ ] QR code tickets

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Created by Aryan

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**⭐ If you find this project useful, please give it a star!**
</body>
</html>