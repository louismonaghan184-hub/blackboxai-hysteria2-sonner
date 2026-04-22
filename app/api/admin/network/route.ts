import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { TrafficBlender } from "@/lib/traffic/blending"

let blender: TrafficBlender | null = null

function getBlender(): TrafficBlender {
  if (!blender) {
    blender = new TrafficBlender()
  }
  return blender
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const b = getBlender()
    const profiles = b.getProfiles()
    const stats = b.getStatistics()

    return NextResponse.json({
      profiles,
      statistics: stats,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch network data" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const b = getBlender()

    const profile = b.createProfile(body)

    return NextResponse.json({
      success: true,
      profile,
      message: "Traffic profile created",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create traffic profile" },
      { status: 500 },
    )
  }
}
