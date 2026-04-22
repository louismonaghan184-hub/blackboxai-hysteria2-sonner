import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { InfrastructureMonitor } from "@/lib/infrastructure/monitoring"

let monitor: InfrastructureMonitor | null = null

function getMonitor(): InfrastructureMonitor {
  if (!monitor) {
    monitor = new InfrastructureMonitor()
  }
  return monitor
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const m = getMonitor()
    const metrics = m.getMetrics()
    const alerts = m.getAlerts()

    return NextResponse.json({
      metrics,
      alerts,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 },
    )
  }
}
