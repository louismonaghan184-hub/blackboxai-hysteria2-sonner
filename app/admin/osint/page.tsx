"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface OsintResult {
  id: string
  source: string
  query: string
  status: string
  resultCount: number
}

export default function OsintPage() {
  const [results, setResults] = useState<OsintResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/osint")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setResults(data.results ?? [])
      } catch {
        toast.error("Failed to load OSINT data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">OSINT Collection</h1>
        <p className="text-sm text-muted-foreground">
          Open source intelligence gathering and analysis tools.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>OSINT Queries</CardTitle>
                <CardDescription>Manage intelligence collection queries and results</CardDescription>
              </div>
              <Button>New Query</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground">No OSINT queries yet. Start a new query to begin collection.</p>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{result.source}</h3>
                      <p className="text-sm text-muted-foreground">
                        Query: {result.query} | Results: {result.resultCount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.status === "completed" ? "default" : "secondary"}>
                        {result.status}
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
