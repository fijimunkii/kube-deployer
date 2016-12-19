DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cat <<EOF > $DIR/secrets.yaml
{
    "kind": "Secret",
    "apiVersion": "v1",
    "metadata": {
        "name": "deployer-config",
        "namespace": "$NAMESPACE"
    },
    "data": {
        "config.json": "$(cat $DIR/../config.json | base64)",
        "config": "$(cat $DIR/../config | base64)"
    }
}
EOF
