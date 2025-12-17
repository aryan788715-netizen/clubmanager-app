<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// ClubManager - Complete Application Logic
// Database Layer (LocalStorage with JSON persistence)

const DB = {
    // Core database operations
    get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    getObj: (key) => JSON.parse(localStorage.getItem(key) || '{}'),
    setObj: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    
    // Initialize default data
    init: () => {
        // Default users
        if (DB.get('users').length === 0) {
            DB.set('users', [
                {
                    id: '1',
                    name: 'Club Owner',
                    email: 'owner@club.com',
                    password: 'owner123',
                    role: 'owner'
                },
                {
                    id: '2',
                    name: 'Admin User',
                    email: 'admin@club.com',
                    password: 'admin123',
                    role: 'admin'
                },
                {
                    id: '3',
                    name: 'Regular User',
                    email: 'user@club.com',
                    password: 'user123',
                    role: 'user'
                }
            ]);
        }

        // Default events
        if (DB.get('events').length === 0) {
            DB.set('events', [
                {
                    id: '1',
                    title: 'Summer Music Festival',
                    description: 'Join us for an unforgettable night of live music and entertainment!',
                    date: '2024-12-25',
                    time: '19:00',
                    price: 1500,
                    capacity: 100,
                    venue: 'Grand Arena, Mumbai',
                    booked: 25,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'New Year Bash 2025',
                    description: 'Ring in the new year with style! DJ, drinks, and dancing all night.',
                    date: '2024-12-31',
                    time: '21:00',
                    price: 2500,
                    capacity: 200,
                    venue: 'Skybar Lounge, Delhi',
                    booked: 150,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    title: 'Comedy Night Live',
                    description: 'Laugh out loud with the best comedians in town!',
                    date: '2024-12-20',
                    time: '20:00',
                    price: 800,
                    capacity: 80,
                    venue: 'Comedy Club, Bangalore',
                    booked: 45,
                    createdAt: new Date().toISOString()
                }
            ]);
        }

        // Initialize settings
        if (!localStorage.getItem('settings')) {
            DB.setObj('settings', {
                clubName: 'ClubManager',
                clubDescription: 'Professional Club Management',
                maintenanceMode: false,
                maintenanceMessage: "We're currently performing scheduled maintenance. We'll be back soon!"
            });
        }

        // Initialize empty arrays if needed
        if (!localStorage.getItem('bookings')) DB.set('bookings', []);
        if (!localStorage.getItem('notifications')) DB.set('notifications', []);
    }
};

// Authentication
let currentUser = null;

function login(email, password) {
    const users = DB.get('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showAlert('Invalid email or password', 'error');
        return false;
    }

    // Check maintenance mode (only owner can bypass)
    const settings = DB.getObj('settings');
    if (settings.maintenanceMode && user.role !== 'owner') {
        document.getElementById('maintenanceMessage').textContent = settings.maintenanceMessage;
        document.getElementById('maintenanceScreen').classList.add('active');
        return false;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Hide login, show appropriate dashboard
    document.getElementById('loginPage').style.display = 'none';
    
    if (user.role === 'owner') {
        document.getElementById('ownerDashboard').classList.add('active');
        loadOwnerDashboard();
    } else if (user.role === 'admin') {
        document.getElementById('adminDashboard').classList.add('active');
        loadAdminDashboard();
    } else {
        document.getElementById('userDashboard').classList.add('active');
        loadUserDashboard();
    }
    
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Hide all dashboards
    document.getElementById('ownerDashboard').classList.remove('active');
    document.getElementById('adminDashboard').classList.remove('active');
    document.getElementById('userDashboard').classList.remove('active');
    
    // Show login
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginAlert').innerHTML = '';
}

function showAlert(message, type) {
    const alertDiv = document.getElementById('loginAlert');
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => alertDiv.innerHTML = '', 5000);
}

// Check for existing session
function checkSession() {
    const settings = DB.getObj('settings');
    
    // Check maintenance mode first
    if (settings.maintenanceMode) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user.role !== 'owner') {
                document.getElementById('maintenanceMessage').textContent = settings.maintenanceMessage;
                document.getElementById('maintenanceScreen').classList.add('active');
                return;
            }
        } else {
            document.getElementById('maintenanceMessage').textContent = settings.maintenanceMessage;
            document.getElementById('maintenanceScreen').classList.add('active');
            return;
        }
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('loginPage').style.display = 'none';
        
        if (currentUser.role === 'owner') {
            document.getElementById('ownerDashboard').classList.add('active');
            loadOwnerDashboard();
        } else if (currentUser.role === 'admin') {
            document.getElementById('adminDashboard').classList.add('active');
            loadAdminDashboard();
        } else {
            document.getElementById('userDashboard').classList.add('active');
            loadUserDashboard();
        }
    }
}

// Owner Dashboard Functions
function loadOwnerDashboard() {
    const events = DB.get('events');
    const bookings = DB.get('bookings');
    const users = DB.get('users').filter(u => u.role === 'user');
    const admins = DB.get('users').filter(u => u.role === 'admin');
    
    const revenue = bookings.reduce((sum, b) => {
        const event = events.find(e => e.id === b.eventId);
        return sum + (event ? event.price * b.guests : 0);
    }, 0);

    document.getElementById('ownerStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Total Events</div>
                    <div class="stat-value">${events.length}</div>
                </div>
                <div class="stat-icon">🎉</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Total Bookings</div>
                    <div class="stat-value">${bookings.length}</div>
                </div>
                <div class="stat-icon">📅</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Revenue</div>
                    <div class="stat-value">₹${(revenue/1000).toFixed(1)}K</div>
                </div>
                <div class="stat-icon">💰</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Users</div>
                    <div class="stat-value">${users.length}</div>
                </div>
                <div class="stat-icon">👥</div>
            </div>
        </div>
    `;

    const settings = DB.getObj('settings');
    document.getElementById('ownerOverview').innerHTML = `
        <div class="alert alert-info">
            <span>ℹ️</span>
            <div>
                <strong>System Status:</strong> ${settings.maintenanceMode ? '🔧 MAINTENANCE MODE ACTIVE' : '✅ All systems operational'}<br>
                <strong>Admins:</strong> ${admins.length} active<br>
                <strong>Total Users:</strong> ${users.length}<br>
                <strong>Total Events:</strong> ${events.length}
            </div>
        </div>
    `;

    renderOwnerEvents();
    renderOwnerBookings();
    renderOwnerUsers();
    renderOwnerAdmins();
    loadCustomizeForm();
    loadMaintenanceForm();
}

function renderOwnerEvents() {
    const events = DB.get('events');
    const container = document.getElementById('ownerEventsList');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">No Events</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Booked</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${events.map(e => `
                    <tr>
                        <td><strong>${e.title}</strong></td>
                        <td>${new Date(e.date).toLocaleDateString()}</td>
                        <td>₹${e.price.toLocaleString()}</td>
                        <td>${e.capacity}</td>
                        <td><span class="badge badge-info">${e.booked || 0}/${e.capacity}</span></td>
                        <td>
                            <button class="btn-sm btn-primary" onclick="editEvent('${e.id}')">Edit</button>
                            <button class="btn-sm btn-danger" onclick="deleteEvent('${e.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderOwnerBookings() {
    const bookings = DB.get('bookings');
    const events = DB.get('events');
    const users = DB.get('users');
    const container = document.getElementById('ownerBookingsList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">No Bookings</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Event</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(b => {
                    const event = events.find(e => e.id === b.eventId);
                    const user = users.find(u => u.id === b.userId);
                    return `
                        <tr>
                            <td><strong>#${b.id.slice(-6)}</strong></td>
                            <td>${user?.name || 'Unknown'}</td>
                            <td>${event?.title || 'Unknown'}</td>
                            <td>${b.guests}</td>
                            <td><strong>₹${b.totalAmount.toLocaleString()}</strong></td>
                            <td><span class="badge badge-success">CONFIRMED</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderOwnerUsers() {
    const users = DB.get('users').filter(u => u.role === 'user');
    const bookings = DB.get('bookings');
    const container = document.getElementById('ownerUsersList');
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Bookings</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(u => {
                    const count = bookings.filter(b => b.userId === u.id).length;
                    return `
                        <tr>
                            <td><strong>${u.name}</strong></td>
                            <td>${u.email}</td>
                            <td><span class="badge badge-info">${count}</span></td>
                            <td><span class="badge badge-primary">USER</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderOwnerAdmins() {
    const admins = DB.get('users').filter(u => u.role === 'admin');
    const container = document.getElementById('ownerAdminsList');
    
    if (admins.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">👨‍💼</div><div class="empty-title">No Admins</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${admins.map(a => `
                    <tr>
                        <td><strong>${a.name}</strong></td>
                        <td>${a.email}</td>
                        <td>
                            <button class="btn-sm btn-danger" onclick="deleteAdmin('${a.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadCustomizeForm() {
    const settings = DB.getObj('settings');
    document.getElementById('clubName').value = settings.clubName || 'ClubManager';
    document.getElementById('clubDesc').value = settings.clubDescription || 'Professional Club Management';
}

function loadMaintenanceForm() {
    const settings = DB.getObj('settings');
    document.getElementById('maintenanceToggle').checked = settings.maintenanceMode || false;
    document.getElementById('maintenanceMsg').value = settings.maintenanceMessage || "We're currently performing scheduled maintenance. We'll be back soon!";
}

function showOwnerPage(page) {
    document.querySelectorAll('#ownerDashboard .nav-item').forEach(i => i.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    document.querySelectorAll('#ownerDashboard .page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('owner' + page.charAt(0).toUpperCase() + page.slice(1) + 'Page').classList.add('active');
    
    const titles = {
        dashboard: 'Dashboard',
        events: 'Manage Events',
        bookings: 'All Bookings',
        users: 'Registered Users',
        admins: 'Manage Admins',
        customize: 'Customize Club',
        maintenance: 'Maintenance Mode'
    };
    document.getElementById('ownerPageTitle').textContent = titles[page];
}

// Admin Dashboard Functions
function loadAdminDashboard() {
    const events = DB.get('events');
    const bookings = DB.get('bookings');
    
    const revenue = bookings.reduce((sum, b) => {
        const event = events.find(e => e.id === b.eventId);
        return sum + (event ? event.price * b.guests : 0);
    }, 0);

    document.getElementById('adminStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Total Events</div>
                    <div class="stat-value">${events.length}</div>
                </div>
                <div class="stat-icon">🎉</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Total Bookings</div>
                    <div class="stat-value">${bookings.length}</div>
                </div>
                <div class="stat-icon">📅</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Revenue</div>
                    <div class="stat-value">₹${(revenue/1000).toFixed(1)}K</div>
                </div>
                <div class="stat-icon">💰</div>
            </div>
        </div>
    `;

    renderAdminEvents();
    renderAdminBookings();
}

function renderAdminEvents() {
    const events = DB.get('events');
    const container = document.getElementById('adminEventsList');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">No Events</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Booked</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${events.map(e => `
                    <tr>
                        <td><strong>${e.title}</strong></td>
                        <td>${new Date(e.date).toLocaleDateString()}</td>
                        <td>₹${e.price.toLocaleString()}</td>
                        <td>${e.capacity}</td>
                        <td><span class="badge badge-info">${e.booked || 0}/${e.capacity}</span></td>
                        <td>
                            <button class="btn-sm btn-primary" onclick="editEvent('${e.id}')">Edit</button>
                            <button class="btn-sm btn-danger" onclick="deleteEvent('${e.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderAdminBookings() {
    const bookings = DB.get('bookings');
    const events = DB.get('events');
    const users = DB.get('users');
    const container = document.getElementById('adminBookingsList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">No Bookings</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Event</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(b => {
                    const event = events.find(e => e.id === b.eventId);
                    const user = users.find(u => u.id === b.userId);
                    return `
                        <tr>
                            <td><strong>#${b.id.slice(-6)}</strong></td>
                            <td>${user?.name || 'Unknown'}</td>
                            <td>${event?.title || 'Unknown'}</td>
                            <td>${b.guests}</td>
                            <td><strong>₹${b.totalAmount.toLocaleString()}</strong></td>
                            <td><span class="badge badge-success">CONFIRMED</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function showAdminPage(page) {
    document.querySelectorAll('#adminDashboard .nav-item').forEach(i => i.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    document.querySelectorAll('#adminDashboard .page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('admin' + page.charAt(0).toUpperCase() + page.slice(1) + 'Page').classList.add('active');
    
    const titles = {
        dashboard: 'Dashboard',
        events: 'Manage Events',
        bookings: 'All Bookings',
        notifications: 'Send Notification'
    };
    document.getElementById('adminPageTitle').textContent = titles[page];
}

// User Dashboard Functions
function loadUserDashboard() {
    document.getElementById('userName').textContent = currentUser.name;
    renderUserEvents();
    renderUserBookings();
    renderUserNotifications();
}

function renderUserEvents() {
    const events = DB.get('events');
    const container = document.getElementById('userEventsList');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">No Events Available</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Date & Time</th>
                    <th>Venue</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${events.map(e => {
                    const available = e.capacity - (e.booked || 0);
                    const isSoldOut = available <= 0;
                    return `
                        <tr>
                            <td>
                                <strong>${e.title}</strong><br>
                                <small style="color: var(--gray);">${e.description}</small>
                            </td>
                            <td>${new Date(e.date).toLocaleDateString()}<br>${e.time}</td>
                            <td>${e.venue}</td>
                            <td><strong>₹${e.price.toLocaleString()}</strong></td>
                            <td><span class="badge ${isSoldOut ? 'badge-danger' : 'badge-success'}">${isSoldOut ? 'SOLD OUT' : available + ' spots'}</span></td>
                            <td>
                                <button class="btn-sm btn-primary" onclick="openBookingModal('${e.id}')" ${isSoldOut ? 'disabled' : ''}>
                                    ${isSoldOut ? 'Sold Out' : 'Book Now'}
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderUserBookings() {
    const bookings = DB.get('bookings').filter(b => b.userId === currentUser.id);
    const events = DB.get('events');
    const container = document.getElementById('userBookingsList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">No Bookings Yet</div></div>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Event</th>
                    <th>Date & Time</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(b => {
                    const event = events.find(e => e.id === b.eventId);
                    return `
                        <tr>
                            <td><strong>#${b.id.slice(-6)}</strong></td>
                            <td>${event?.title || 'Unknown'}</td>
                            <td>${new Date(event?.date).toLocaleDateString()}<br>${event?.time}</td>
                            <td>${b.guests}</td>
                            <td><strong>₹${b.totalAmount.toLocaleString()}</strong></td>
                            <td><span class="badge badge-success">CONFIRMED</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function renderUserNotifications() {
    const notifs = DB.get('notifications');
    const container = document.getElementById('userNotificationsList');
    
    if (notifs.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-title">No Notifications</div></div>';
        return;
    }

    container.innerHTML = notifs.slice().reverse().map(n => `
        <div class="alert alert-info" style="margin-bottom: 15px;">
            <span>📢</span>
            <div>
                <strong>${n.title}</strong><br>
                ${n.message}<br>
                <small style="color: var(--gray);">${new Date(n.date).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

function showUserPage(page) {
    document.querySelectorAll('#userDashboard .nav-item').forEach(i => i.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    document.querySelectorAll('#userDashboard .page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('user' + page.charAt(0).toUpperCase() + page.slice(1) + 'Page').classList.add('active');
    
    const titles = {
        events: 'Events',
        bookings: 'My Bookings',
        notifications: 'Notifications'
    };
    document.getElementById('userPageTitle').textContent = titles[page];
}

// Event Management
let editingEventId = null;

function openEventModal(eventId = null) {
    editingEventId = eventId;
    
    if (eventId) {
        const events = DB.get('events');
        const event = events.find(e => e.id === eventId);
        
        document.getElementById('eventModalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDesc').value = event.description;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventPrice').value = event.price;
        document.getElementById('eventCapacity').value = event.capacity;
        document.getElementById('eventVenue').value = event.venue;
    } else {
        document.getElementById('eventModalTitle').textContent = 'Add Event';
        document.getElementById('eventForm').reset();
        document.getElementById('eventId').value = '';
    }
    
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    editingEventId = null;
}

function editEvent(id) {
    openEventModal(id);
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        const events = DB.get('events').filter(e => e.id !== id);
        DB.set('events', events);
        
        if (currentUser.role === 'owner') {
            loadOwnerDashboard();
        } else {
            loadAdminDashboard();
        }
    }
}

// Admin Management
function openAdminModal() {
    document.getElementById('adminModal').classList.add('active');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('active');
    document.getElementById('adminForm').reset();
}

function deleteAdmin(id) {
    if (confirm('Are you sure you want to delete this admin?')) {
        const users = DB.get('users').filter(u => u.id !== id);
        DB.set('users', users);
        loadOwnerDashboard();
    }
}

// Booking Management
let selectedEvent = null;

function openBookingModal(eventId) {
    const events = DB.get('events');
    selectedEvent = events.find(e => e.id === eventId);
    
    document.getElementById('bookingEventTitle').textContent = selectedEvent.title;
    document.getElementById('bookingEventId').value = selectedEvent.id;
    document.getElementById('bookingEventDetails').innerHTML = `
        <div class="alert alert-info">
            <span>ℹ️</span>
            <div>
                <strong>Date:</strong> ${new Date(selectedEvent.date).toLocaleDateString()}<br>
                <strong>Time:</strong> ${selectedEvent.time}<br>
                <strong>Venue:</strong> ${selectedEvent.venue}<br>
                <strong>Price:</strong> ₹${selectedEvent.price.toLocaleString()} per person
            </div>
        </div>
    `;
    
    document.getElementById('guestCount').value = 1;
    document.getElementById('guestCount').max = selectedEvent.capacity - (selectedEvent.booked || 0);
    updateTotalAmount();
    
    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    selectedEvent = null;
}

function updateTotalAmount() {
    if (selectedEvent) {
        const guests = parseInt(document.getElementById('guestCount').value) || 1;
        const total = selectedEvent.price * guests;
        document.getElementById('totalAmount').textContent = '₹' + total.toLocaleString();
    }
}

// Form Handlers
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});

document.getElementById('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const events = DB.get('events');
    const eventId = document.getElementById('eventId').value;
    
    const eventData = {
        id: eventId || Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDesc').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        price: parseInt(document.getElementById('eventPrice').value),
        capacity: parseInt(document.getElementById('eventCapacity').value),
        venue: document.getElementById('eventVenue').value,
        booked: 0,
        createdAt: new Date().toISOString()
    };
    
    if (eventId) {
        const index = events.findIndex(e => e.id === eventId);
        const oldEvent = events[index];
        eventData.booked = oldEvent.booked;
        events[index] = eventData;
    } else {
        events.push(eventData);
    }
    
    DB.set('events', events);
    closeEventModal();
    
    if (currentUser.role === 'owner') {
        loadOwnerDashboard();
    } else {
        loadAdminDashboard();
    }
});

document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const users = DB.get('users');
    users.push({
        id: Date.now().toString(),
        name: document.getElementById('adminName').value,
        email: document.getElementById('adminEmail').value,
        password: document.getElementById('adminPassword').value,
        role: 'admin'
    });
    
    DB.set('users', users);
    closeAdminModal();
    loadOwnerDashboard();
});

document.getElementById('customizeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = DB.getObj('settings');
    settings.clubName = document.getElementById('clubName').value;
    settings.clubDescription = document.getElementById('clubDesc').value;
    DB.setObj('settings', settings);
    
    alert('✅ Settings saved successfully!');
});

document.getElementById('maintenanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = DB.getObj('settings');
    settings.maintenanceMode = document.getElementById('maintenanceToggle').checked;
    settings.maintenanceMessage = document.getElementById('maintenanceMsg').value;
    DB.setObj('settings', settings);
    
    alert('✅ Maintenance settings saved!');
    
    if (settings.maintenanceMode) {
        alert('⚠️ Maintenance mode is now ACTIVE. Users and admins will be blocked.');
    }
});

document.getElementById('notificationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const notifs = DB.get('notifications');
    notifs.push({
        id: Date.now().toString(),
        title: document.getElementById('notifTitle').value,
        message: document.getElementById('notifMessage').value,
        date: new Date().toISOString()
    });
    
    DB.set('notifications', notifs);
    document.getElementById('notificationForm').reset();
    alert('✅ Notification sent to all users!');
});

document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const guests = parseInt(document.getElementById('guestCount').value);
    const totalAmount = selectedEvent.price * guests;
    
    const bookings = DB.get('bookings');
    bookings.push({
        id: Date.now().toString(),
        userId: currentUser.id,
        eventId: selectedEvent.id,
        guests,
        totalAmount,
        bookingDate: new Date().toISOString()
    });
    DB.set('bookings', bookings);
    
    const events = DB.get('events');
    const eventIndex = events.findIndex(e => e.id === selectedEvent.id);
    events[eventIndex].booked = (events[eventIndex].booked || 0) + guests;
    DB.set('events', events);
    
    closeBookingModal();
    alert('🎉 Booking confirmed!');
    loadUserDashboard();
});

document.getElementById('guestCount').addEventListener('input', updateTotalAmount);

// Initialize
DB.init();
checkSession();
</body>
</html>