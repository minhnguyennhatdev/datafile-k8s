# Run

> URL: http://localhost:3005/api/v1/chart/history

- docker-compose up -d --build

# Environment Variables

- Path of data folder

```
  PORT=3005
  ROOT_PATH_TEA=/app
```

```
# Start
minikube addons enable registry
kubectl api-resources

minikube dashboard
minikube start

# Build image & load
docker scout quickview
docker build -t teafiles/teafiles-service .
docker-compose up --build
minikube image load teafiles/teafiles-service

# Build template
kubectl create namespace teafiles
kubectl apply -f kuber.yml
kubectl delete -f kuber.yml

# Test
kubectl get pods
minikube image ls
minikube service list
kubectl get services
kubectl get nodes -o wide
minikube service teafiles-service

# Create secrets
ssh-keygen -t rsa -b 4096 -f ~/.ssh/rsync-key
kubectl --namespace=teafiles create secret generic rsync-config --from-file=rsync-key=/Users/neo/.ssh/rsync-key --from-literal=remote-server=root@127.0.0.1

#kubectl create secret generic rsync-private-key --from-file=rsync-key=/Users/neo/.ssh/rsync-key
kubectl delete secret rsync-private-key
```


## Kubernetes integration

### Deploy into Kubernetes Local (Using minikube)

1. Install Docker desktop + minikube

```sh
  minikube start
  minikube dashboard
```

2. Create namespace:

```sh
  kubectl create namespace teafiles
```

3. Deploy container:

```sh
# Build docker image
  docker build -t teafile-service:latest .
  minikube image load teafile-service:latest

  # Create secret key for Sync Teafiles from Another Server
  kubectl create secret generic rsync-config --namespace=teafiles \
      --from-file=rsync-key=/Users/yourname/.ssh/rsync-key \
      --from-literal=remote-server=user@remote-server \
      --from-literal=remote-port=22

  # Deploy to K8s development
  kubectl apply -f k8s-development.yml --namespace=teafiles

  # Delete container
  kubectl delete -f k8s-development.yml --namespace=teafiles

  # Delete private key:
  kubectl delete secret rsync-config --namespace=teafiles

  # Others:
  minikube kubectl get pods
  kubectl get nodes -o wide
  minikube service list
  minikube image ls
  minikube service teafiles-service
```

### Deploy into Kubernetes Production (Using Digital Ocean)

1. Create a Kubernetes service on D.0 and API Token
2. Create a Container registry on D.0
  - Create registry with name: teafiles
  - Push images into Docker CLI

```sh
  brew install doctl
  doctl registry login
  docker login registry.digitalocean.com

  # Build docker image
  docker build --platform=linux/amd64 -t teafiles-service:v1 .

  docker tag teafiles-service:v1 registry.digitalocean.com/teafiles/teafiles-service:v1

  docker push registry.digitalocean.com/teafiles/teafiles-service:v1

  # Digital Ocean CTL:
  doctl account get
  doctl auth list
  doctl auth init --context tea-k8s
  doctl auth switch --context tea-k8s
  doctl registry get
  doctl registry repository list-v2
  doctl kubernetes cluster kubeconfig save 5c097da1-0c13-4f96-90d2-af563d30e39d
```

3. Create namespace:

```sh
  kubectl create namespace teafiles
```

4. Deploy container:

```sh
  # Create secret key for Sync Teafiles from Another Server
  kubectl create secret generic rsync-config --namespace=teafiles \
      --from-file=rsync-key=/Users/yourname/.ssh/rsync-key \
      --from-literal=remote-server=user@remote-server \
      --from-literal=remote-port=22

  # Deploy to K8s Digital Ocean
  kubectl apply -f k8s-production.yml --namespace=teafiles

  # Delete container
  kubectl delete -f k8s-production.yml --namespace=teafiles

  # Restart:
  kubectl rollout restart
  kubectl rollout restart deployment teafiles-service-deployment -n teafiles

  # Delete private key:
  kubectl delete secret rsync-config --namespace=teafiles

  # Others:
  kubectl get pods -o wide --namespace teafiles
  kubectl config get-contexts
  kubectl cluster-info
  kubectl get services
  kubectl get nodes
  kubectl get pods --namespace teafiles
  kubectl --namespace teafiles exec teafiles-service-6d95484f5f-kq75j -- ls
  kubectl get serviceaccount default -o yaml
  kubectl api-resources

```
