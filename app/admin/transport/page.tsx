"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface TransportAdapter {
  id: string
  type: string
  status: string
  description: string
}

export default function TransportPage() {
  const [adapters, setAdapters] = useState<TransportAdapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/transport")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setAdapters(data.adapters ?? [])
      } catch {
        toast.error("Failed to load transport adapters")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Multi-Transport Protocols</h1>
        <p className="text-sm text-muted-foreground">
          Configure and manage transport protocols for secure communication channels.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Protocol Configuration</CardTitle>
            <CardDescription>Manage transport protocol settings and encryption</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : adapters.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transport adapters configured yet.</p>
            ) : (
              <div className="space-y-4">
                {adapters.map((adapter) => (
                  <div key={adapter.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{adapter.type}</h3>
                      <p className="text-sm text-muted-foreground">{adapter.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={adapter.status === "connected" ? "default" : "secondary"}>
                        {adapter.status}
                      </Badge>
                      <Button size="sm" variant="outline">Configure</Button>
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
