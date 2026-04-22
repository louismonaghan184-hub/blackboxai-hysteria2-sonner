"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ThreatOperation {
  id: string
  name: string
  type: string
  status: string
  priority: string
}

export default function ThreatPage() {
  const [operations, setOperations] = useState<ThreatOperation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/threat")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setOperations(data.operations ?? [])
      } catch {
        toast.error("Failed to load threat intel")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Threat Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Track threat intelligence feeds, indicators of compromise, and red team operations.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Operations</CardTitle>
                <CardDescription>Active red team operations and assessments</CardDescription>
              </div>
              <Button>New Operation</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : operations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No operations yet.</p>
            ) : (
              <div className="space-y-4">
                {operations.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{op.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {op.type} | Priority: {op.priority}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={op.status === "running" ? "default" : "secondary"}>
                        {op.status}
                      </Badge>
                      <Button size="sm" variant="outline">View</Button>
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
