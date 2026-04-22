"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Report {
  id: string
  title: string
  type: string
  status: string
  generatedAt: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/reports")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setReports(data.reports ?? [])
      } catch {
        toast.error("Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate and manage operation reports, executive summaries, and technical findings.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>View and download previously generated reports</CardDescription>
              </div>
              <Button>Generate Report</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports generated yet.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {report.type} | Generated: {report.generatedAt}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
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
