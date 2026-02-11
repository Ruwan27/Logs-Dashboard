# 📊 Logs Dashboard

A full-stack, production-quality application for managing and visualizing application logs. Built with FastAPI (Python) backend and Next.js (TypeScript) frontend.
## 🛠 Tech Stack

| Layer                | Technology                             |
| -------------------- | -------------------------------------- |
| **Backend**          | FastAPI, SQLAlchemy, Pydantic, Alembic |
| **Database**         | PostgreSQL 15                          |
| **Frontend**         | Next.js 14, React 18, TypeScript       |
| **Styling**          | Tailwind CSS                           |
| **Charts**           | Recharts                               |
| **HTTP Client**      | Axios                                  |
| **Containerization** | Docker, Docker Compose                 |
| **Testing**          | pytest, httpx                          |


## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Running with Docker Compose

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd logs-dashboard
   ```

2. **Start all services**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

That's it! The database will be automatically initialized with sample data.

### Stopping the Application

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

---

## 💻 Local Development

### Backend

1. **Create virtual environment**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**

   ```bash
   export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logs_dashboard
   ```

4. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Set environment variables**

   ```bash
   export NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```


## 🙏 Acknowledgments

- FastAPI documentation
- Next.js documentation
- Tailwind CSS
- Recharts
