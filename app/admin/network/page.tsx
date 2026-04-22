"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface TrafficProfile {
  id: string
  name: string
  type: string
  enabled: boolean
  noiseRatio: number
}

export default function NetworkPage() {
  const [profiles, setProfiles] = useState<TrafficProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/network")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setProfiles(data.profiles ?? [])
      } catch {
        toast.error("Failed to load network data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Network Traffic Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor and manage network traffic blending and routing profiles.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Traffic Profiles</CardTitle>
                <CardDescription>Configure traffic blending and camouflage profiles</CardDescription>
              </div>
              <Button>New Profile</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : profiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No traffic profiles configured yet.</p>
            ) : (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {profile.type} | Noise: {(profile.noiseRatio * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={profile.enabled ? "default" : "secondary"}>
                        {profile.enabled ? "Active" : "Inactive"}
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
