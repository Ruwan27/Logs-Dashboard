# Kubernetes Deployment Guide - Logs Dashboard Backend

## Prerequisites

### Required Tools

```bash
# kubectl (Kubernetes CLI)
# Windows (winget)
winget install -e --id Kubernetes.kubectl

# Linux/macOS
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Docker
# For building images locally
docker --version

# (Optional) Kustomize - built into kubectl v1.14+
kubectl kustomize --help

## Quick Start

### Option 1: Using Kustomize (Recommended)

```bash
# 1. Build Docker image
cd backend
docker build -t logs-dashboard-backend:latest .
cd frontend
docker build -t logs-dashboard-frontend:latest .

# 2. For Minikube: Load image into cluster
minikube image load logs-dashboard-backend:latest
minikube image load logs-dashboard-frontend:latest
# 3. Deploy everything
cd ../k8s
kubectl apply -k .

# 4. Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n logs-dashboard --timeout=120s
kubectl wait --for=condition=ready pod -l app=backend -n logs-dashboard --timeout=120s

# 5. Port forward to access locally
kubectl port-forward svc/backend-service 8000:8000 -n logs-dashboard
kubectl port-forward svc/frontend-service 3000:3000 -n logs-dashboard
# 6. Test
http://localhost:3000
```


# Check all resources
kubectl get all -n logs-dashboard

# Check pods
kubectl get pods -n logs-dashboard -w

# The result after deploying all services using the above resource command

 kubectl get all -n logs-dashboard
NAME                            READY   STATUS    RESTARTS        AGE
pod/backend-78cb4f8d7-8cdpx     1/1     Running   10 (62m ago)    22h
pod/backend-78cb4f8d7-sm462     1/1     Running   10 (62m ago)    22h
pod/frontend-bdb6b9d8d-64tfz    1/1     Running   0               9m31s
pod/frontend-bdb6b9d8d-z68s6    1/1     Running   0               9m31s
pod/postgres-6bdc55695f-d9rz8   1/1     Running   3 (5h45m ago)   22h

NAME                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/backend-service    ClusterIP   10.111.80.98    <none>        8000/TCP   22h
service/frontend-service   ClusterIP   10.98.176.243   <none>        3000/TCP   9m32s
service/postgres-service   ClusterIP   10.110.123.20   <none>        5432/TCP   22h

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/backend    2/2     2            2           22h
deployment.apps/frontend   2/2     2            2           9m31s
deployment.apps/postgres   1/1     1            1           22h

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/backend-78cb4f8d7     2         2         2       22h
replicaset.apps/frontend-bdb6b9d8d    2         2         2       9m31s
replicaset.apps/postgres-6bdc55695f   1         1         1       22h





