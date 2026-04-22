import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { GlobalKillSwitch } from "@/lib/security/killswitch"
import { SecurityControls } from "@/lib/security/controls"

let killSwitch: GlobalKillSwitch | null = null
let securityControls: SecurityControls | null = null

function getKillSwitch(): GlobalKillSwitch {
  if (!killSwitch) {
    killSwitch = new GlobalKillSwitch()
  }
  return killSwitch
}

function getSecurityControls(): SecurityControls {
  if (!securityControls) {
    securityControls = new SecurityControls()
  }
  return securityControls
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const ks = getKillSwitch()
    const sc = getSecurityControls()

    return NextResponse.json({
      killSwitches: ks.listSwitches(),
      controls: sc.listControls(),
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch LotL data" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const ks = getKillSwitch()

    const result = await ks.create(body)

    return NextResponse.json({
      success: true,
      result,
      message: "Kill switch configured",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to configure kill switch" },
      { status: 500 },
    )
  }
}
