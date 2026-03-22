# Self-Hosted Runner Setup Guide (Ubuntu)
Please note that this is my Ubuntu machine. If you are using Windows or macOS, only change the self-hosted runner part. If you go to GitHub and select a new hosted runner for macOS or Windows, follow the instructions below for macOS or Windows.
## Prerequisites

- **Git** — `git --version`
- **Docker Desktop** — `docker --version` + `docker compose version`
- **Python 3.11+** — `python --version` (CI tests)
- **Node.js 20+** — `node --version` (CI frontend lint/build)

---

---

## Step 2: Self-Hosted Runner Install 

Step 2: Install Self-Hosted Runner on Ubuntu 20.04
Go to your GitHub repository page

Navigate to Settings → Actions → Runners → New self-hosted runner

Select Linux as the operating system and x64 as the architecture

Follow the commands shown on GitHub (similar to below):

bash
# Create a runner folder (outside your project folder)
mkdir ~/actions-runner && cd ~/actions-runner

# Download the latest runner package (copy the URL from GitHub page)
curl -o actions-runner-linux-x64-2.321.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-x64-2.321.0.tar.gz

# Extract the package
tar xzf ./actions-runner-linux-x64-2.321.0.tar.gz

# Configure the runner (copy the URL and token from GitHub page)
./config.sh --url https://github.com/<YOUR_USERNAME>/logs-dashboard --token <YOUR_TOKEN>
During configuration, you'll be prompted for:

Runner group: Press Enter (accept default)

Runner name: Press Enter (defaults to your machine's hostname)

Labels: Type self-hosted,Linux,X64 or press Enter for defaults

Work folder: Press Enter (defaults to _work)

Additional Setup for Ubuntu
After configuration, you may want to install the runner as a service:

bash
# Install and start the service
sudo ./svc.sh install
sudo ./svc.sh start

# Check status
sudo ./svc.sh status


---

## Step 4: GitHub Secrets Add 

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**


| Secret Name           | Value                                                   |
| --------------------- | ------------------------------------------------------- |
| `POSTGRES_USER`       | `postgres`                                              |
| `POSTGRES_PASSWORD`   | `postgres`      |
| `POSTGRES_DB`         | `logs_dashboard`                                        |
| `DATABASE_URL`        | `postgresql://postgres:postgres@db:5432/logs_dashboard` |
| `CORS_ORIGINS`        | `http://localhost:3000`                                 |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000`                                 |

---

## Step 5: Verify

```bash
# Test commit push 
git add .
git commit -m "Add CI/CD pipeline"
git push origin pro
```

GitHub repo → **Actions** tab :

1. Check if the "CI - Test & Lint" workflow runs
2. After CI passes, check if the "Deploy" workflow auto-triggers
3. After deploy completes:

```powershell
# Containers check 
docker ps

# Backend health check
curl http://localhost:8000/health

# Frontend check
curl http://localhost:3000
```

---

## Pipeline Flow

```
  Push to main/develop
        │
        ▼
  ┌─────────────┐
  │  CI Workflow │  (backend tests + frontend lint/build)
  └──────┬──────┘
         │ ✅ Pass + main branch only
         ▼
  ┌──────────────┐
  │Deploy Workflow│  (docker compose build + restart)
  └──────┬───────┘
         │
         ▼
  ┌──────────────────────────────────────┐
  │  Docker Compose (this PC)            │
  │  ┌─────┐  ┌─────────┐  ┌──────────┐ │
  │  │ DB  │  │ Backend │  │ Frontend │ │
  │  │:5437│  │  :8000  │  │  :3000   │ │
  │  └─────┘  └─────────┘  └──────────┘ │
  └──────────────────────────────────────┘
```

---

## Troubleshooting

### Runner Offline?

```powershell
cd C:\actions-runner
.\svc.cmd status
.\svc.cmd start   # restart if needed
```

### Docker Build Fail?

```powershell
docker compose logs backend
docker compose logs frontend
```

### Tests Fail Locally?

```powershell
cd backend
pip install -r requirements.txt
pytest --tb=short -q
```

### Re-deploy Manually?

```powershell
cd g:\Class\my-classes\ruwan\2026\logs-dashboard
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
