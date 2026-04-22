"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface KillSwitchEntry {
  id: string
  type: string
  scope: string
  status: string
}

interface SecurityControl {
  id: string
  name: string
  level: string
  active: boolean
}

export default function LotlPage() {
  const [killSwitches, setKillSwitches] = useState<KillSwitchEntry[]>([])
  const [controls, setControls] = useState<SecurityControl[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/lotl")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setKillSwitches(data.killSwitches ?? [])
        setControls(data.controls ?? [])
      } catch {
        toast.error("Failed to load LotL arsenal data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Living off the Land Arsenal</h1>
        <p className="text-sm text-muted-foreground">
          Manage kill switches, security controls, and living-off-the-land techniques.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kill Switches</CardTitle>
                <CardDescription>Global and scoped kill switch management</CardDescription>
              </div>
              <Button>New Kill Switch</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : killSwitches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No kill switches configured.</p>
            ) : (
              <div className="space-y-4">
                {killSwitches.map((ks) => (
                  <div key={ks.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{ks.type}</h3>
                      <p className="text-sm text-muted-foreground">Scope: {ks.scope}</p>
                    </div>
                    <Badge variant={ks.status === "armed" ? "destructive" : "secondary"}>
                      {ks.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Controls</CardTitle>
            <CardDescription>Active security rules and policies</CardDescription>
          </CardHeader>
          <CardContent>
            {controls.length === 0 ? (
              <p className="text-sm text-muted-foreground">No security controls configured.</p>
            ) : (
              <div className="space-y-4">
                {controls.map((ctrl) => (
                  <div key={ctrl.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{ctrl.name}</h3>
                      <p className="text-sm text-muted-foreground">Level: {ctrl.level}</p>
                    </div>
                    <Badge variant={ctrl.active ? "default" : "secondary"}>
                      {ctrl.active ? "Active" : "Inactive"}
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
