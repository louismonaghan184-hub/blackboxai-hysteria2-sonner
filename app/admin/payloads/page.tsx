"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface PayloadConfig {
  id: string
  name: string
  type: string
  architecture: string
  status: string
}

export default function PayloadsPage() {
  const [configs, setConfigs] = useState<PayloadConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/payloads")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setConfigs(data.configs ?? [])
      } catch {
        toast.error("Failed to load payload configs")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dynamic Payload Generation</h1>
        <p className="text-sm text-muted-foreground">
          Generate and manage custom payloads for various platforms and scenarios.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payload Templates</CardTitle>
                <CardDescription>Pre-configured payload templates for rapid deployment</CardDescription>
              </div>
              <Button>Generate New Payload</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : configs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payload configs yet. Generate one to get started.</p>
            ) : (
              <div className="space-y-4">
                {configs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{config.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {config.type} | Arch: {config.architecture}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">{config.status ?? "ready"}</Badge>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
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
