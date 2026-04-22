import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { SecurityControls } from "@/lib/security/controls"

let controls: SecurityControls | null = null

function getControls(): SecurityControls {
  if (!controls) {
    controls = new SecurityControls()
  }
  return controls
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const c = getControls()
    const rules = c.listControls()
    const alerts = c.getAlerts()

    return NextResponse.json({
      rules,
      alerts,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch forensics data" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const c = getControls()

    const rule = c.addControl(body)

    return NextResponse.json({
      success: true,
      rule,
      message: "Anti-forensics rule created",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create rule" },
      { status: 500 },
    )
  }
}
