"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ForensicsRule {
  id: string
  name: string
  type: string
  level: string
  active: boolean
}

export default function ForensicsPage() {
  const [rules, setRules] = useState<ForensicsRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/forensics")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setRules(data.rules ?? [])
      } catch {
        toast.error("Failed to load anti-forensics data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Anti-Forensics</h1>
        <p className="text-sm text-muted-foreground">
          Manage anti-forensic rules and evidence cleanup policies.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Forensics Rules</CardTitle>
                <CardDescription>Configure anti-forensics rules and automated cleanup</CardDescription>
              </div>
              <Button>New Rule</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : rules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No anti-forensics rules configured yet.</p>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {rule.type} | Level: {rule.level}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button size="sm" variant="outline">Edit</Button>
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
