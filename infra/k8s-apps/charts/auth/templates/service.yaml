apiVersion: v1
kind: Service
metadata:
  name: {{ include "auth.fullname" . }}
  labels:
    {{- include "auth.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "auth.selectorLabels" . | nindent 4 }}
