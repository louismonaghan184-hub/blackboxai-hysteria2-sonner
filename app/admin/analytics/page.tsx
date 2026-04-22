"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface AnalyticsAlert {
  id: string
  type: string
  severity: string
  message: string
  timestamp: number
}

export default function AnalyticsPage() {
  const [alerts, setAlerts] = useState<AnalyticsAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setAlerts(data.alerts ?? [])
      } catch {
        toast.error("Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Behavioral Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Advanced behavioral analysis and anomaly detection for security monitoring.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Monitor and analyze behavioral patterns</CardDescription>
              </div>
              <Button>Generate Report</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No alerts. Monitoring is active.</p>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{alert.type}</h3>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
