provider "helm" {
  kubernetes {
    host                   = kind_cluster.default.endpoint
    cluster_ca_certificate = kind_cluster.default.cluster_ca_certificate
    client_certificate     = kind_cluster.default.client_certificate
    client_key             = kind_cluster.default.client_key
  }
}

resource "helm_release" "redis" {
  name  = "redis"
  chart = "../k8s-apps/charts/redis"

  namespace        = "redis"
  create_namespace = true

  values = [
    file("../k8s-apps/charts/redis/values.yaml"),
    file("../k8s-apps/env/local/redis/values.yaml"),
  ]
}

resource "helm_release" "auth" {
  name  = "auth"
  chart = "../k8s-apps/charts/auth"

  values = [
    file("../k8s-apps/charts/auth/values.yaml"),
    file("../k8s-apps/env/local/auth/values.yaml"),
  ]

  depends_on = [helm_release.redis]
}

resource "helm_release" "tracking-gateway" {
  name  = "tracking-gateway"
  chart = "../k8s-apps/charts/tracking-gateway"

  values = [
    file("../k8s-apps/charts/tracking-gateway/values.yaml"),
    file("../k8s-apps/env/local/tracking-gateway/values.yaml"),
  ]

  depends_on = [helm_release.redis]
}

resource "helm_release" "tracking-integrations" {
  name  = "tracking-integrations"
  chart = "../k8s-apps/charts/tracking-integrations"

  values = [
    file("../k8s-apps/charts/tracking-integrations/values.yaml"),
    file("../k8s-apps/env/local/tracking-integrations/values.yaml"),
  ]

  depends_on = [helm_release.redis]
}

