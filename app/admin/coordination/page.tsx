"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CoordinationOp {
  id: string
  name: string
  strategy: string
  status: string
  taskCount: number
}

export default function CoordinationPage() {
  const [operations, setOperations] = useState<CoordinationOp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/coordination")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setOperations(data.operations ?? [])
      } catch {
        toast.error("Failed to load coordination data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Multi-Operator Coordination</h1>
        <p className="text-sm text-muted-foreground">
          Coordinate team operations and manage collaborative red team activities.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Operations</CardTitle>
                <CardDescription>Manage ongoing team operations and assignments</CardDescription>
              </div>
              <Button>New Operation</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : operations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active operations. Create one to get started.</p>
            ) : (
              <div className="space-y-4">
                {operations.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{op.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Strategy: {op.strategy} | Tasks: {op.taskCount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={op.status === "running" ? "default" : "secondary"}>
                        {op.status}
                      </Badge>
                      <Button size="sm" variant="outline">Manage</Button>
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
