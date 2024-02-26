provider "helm" {
  kubernetes {
    host                   = kind_cluster.default.endpoint
    cluster_ca_certificate = kind_cluster.default.cluster_ca_certificate
    client_certificate     = kind_cluster.default.client_certificate
    client_key             = kind_cluster.default.client_key
  }
}

resource "helm_release" "redis" {
  name       = "redis-master.redis"
  chart      = "../k8s-apps/charts/redis"
}

resource "helm_release" "auth" {
  name       = "auth"
  chart      = "../k8s-apps/charts/auth"
}

resource "helm_release" "tracking-gateway" {
  name       = "tracking-gateway"
  chart      = "../k8s-apps/charts/tracking-gateway"
}

resource "helm_release" "tracking-integrations" {
  name       = "tracking-integrations"
  chart      = "../k8s-apps/charts/tracking-integrations"
}

