locals {
  containers = ["auth", "tracking-gateway", "tracking-integrations"]
}

terraform {
  required_providers {
    kind = {
      source  = "tehcyx/kind"
      version = "0.4.0"
    }
  }
}

provider "kind" {}

resource "kind_cluster" "default" {
  name           = "cluster-1"
  wait_for_ready = true
  kind_config {
    kind        = "Cluster"
    api_version = "kind.x-k8s.io/v1alpha4"

    node {
      role = "control-plane"

      kubeadm_config_patches = [
        "kind: InitConfiguration\nnodeRegistration:\n  kubeletExtraArgs:\n    node-labels: \"ingress-ready=true\"\n"
      ]

      extra_port_mappings {
        container_port = 80
        host_port      = 80
      }
      extra_port_mappings {
        container_port = 443
        host_port      = 443
      }
    }

    node {
      role  = "worker"
      image = "kindest/node:v1.27.1"
    }
  }

  depends_on = [null_resource.build_docker_images]
}

resource "null_resource" "build_docker_images" {
  for_each = toset(local.containers)

  provisioner "local-exec" {
    command = "docker build -t jamakase/${each.value}:dev ../../backend/tracking-gateway -f ../../backend/tracking-gateway/apps/${each.value}/Dockerfile"
  }
}

resource "null_resource" "push_images_to_kind" {
  for_each = toset(local.containers)

  provisioner "local-exec" {
    command = "kind load docker-image jamakase/${each.value}:dev --name ${kind_cluster.default.name}"
  }
}

