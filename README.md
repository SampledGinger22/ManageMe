# ManageMe - People Management Platform

A comprehensive people management platform designed for team leaders to track, understand, and develop their team members.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Windows, macOS, or Linux

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ManageMe.git
cd ManageMe

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the application (frontend + backend)
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Default Login
- Username: `admin`
- Password: `admin123`

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend
- **Express.js** - Node.js web framework
- **SQLite** - Local database
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📁 Project Structure

```
ManageMe/
├── src/                    # Frontend source code
│   ├── components/         # React components (atomic design)
│   │   ├── atoms/         # Basic building blocks
│   │   ├── molecules/     # Combinations of atoms
│   │   ├── organisms/     # Complex UI sections
│   │   └── templates/     # Page layouts
│   ├── pages/             # Route pages
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── styles/            # CSS and themes
│   └── types/             # TypeScript definitions
├── server/                # Backend source code
│   ├── database/          # Database initialization
│   └── routes/            # API route handlers
├── docs/                  # Documentation
└── manageme.db           # SQLite database (auto-created)
```

## 🌟 Features

### Current Features
✅ **User Authentication** - Secure login/register with bcrypt  
✅ **People Management** - Add, edit, view team member profiles  
✅ **Task Management** - Create and manage tasks with assignments  
✅ **Team Organization** - Group people into teams  
✅ **Dark/Light Mode** - Theme switching support  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **SQLite Database** - Local data persistence  

### Planned Features
🚧 **Dashboard Analytics** - Team insights and metrics  
🚧 **Kanban Board** - Visual task management  
🚧 **Calendar Integration** - Google Calendar sync  
📝 **Meeting Scheduler** - Smart meeting suggestions  
📝 **1-on-1 Tracking** - Meeting notes and follow-ups  
📝 **Standup Management** - Daily standup tracking  
📝 **Skills Matrix** - Team skill assessment  
📝 **Export/Import** - Data portability  

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_PATH=./manageme.db  # Path to SQLite database

# Server Configuration
PORT=3001                     # Backend server port
```

### Database Management

The database is automatically created and seeded on first run. To reset:

```bash
# Delete the database file
rm manageme.db

# Restart the application
npm start
```

To use a different database:
1. Update `DATABASE_PATH` in `.env`
2. Restart the application

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check auth status

### People Management
- `GET /api/people` - List all people
- `GET /api/people/:id` - Get person by ID
- `POST /api/people` - Create new person
- `PUT /api/people/:id` - Update person
- `DELETE /api/people/:id` - Delete person

### Task Management
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🚀 Development

### Available Scripts

```bash
# Development
npm start          # Start frontend and backend
npm run client     # Start frontend only
npm run server     # Start backend only

# Building
npm run build      # Build for production
npm run preview    # Preview production build

# Code Quality
npm run lint       # Run ESLint
```

### Development Tips

1. **Windows Users**: The project is configured to work with Windows PowerShell
2. **Database Location**: Check `.env` for database path
3. **API Proxy**: Vite proxies `/api` requests to Express server
4. **Hot Reload**: Both frontend and backend support hot reloading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React, Vite, and Express
- UI components from Ant Design
- Icons from Ant Design Icons
- Database powered by SQLite

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Review the CLAUDE.md file for AI assistance guidelines

---

**Project Status**: 🚧 Active Development

Last Updated: December 21, 2024
