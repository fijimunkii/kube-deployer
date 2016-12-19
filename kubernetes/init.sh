export NAMESPACE="myapp"
export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -f $DIR/secrets.yaml ]; then bash $DIR/secrets.sh; fi

kubectl create -f $DIR/secrets.yaml
kubectl create -f $DIR/deployment.yaml
