import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { RedTeamPlanner } from "@/lib/redteam/planner"

let planner: RedTeamPlanner | null = null

function getPlanner(): RedTeamPlanner {
  if (!planner) {
    planner = new RedTeamPlanner()
  }
  return planner
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const p = getPlanner()
    const operations = p.listOperations()
    const stats = p.getStatistics()

    return NextResponse.json({
      operations,
      statistics: stats,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch threat intel" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const p = getPlanner()

    const operation = p.createOperation(body)

    return NextResponse.json({
      success: true,
      operation,
      message: "Operation created",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create operation" },
      { status: 500 },
    )
  }
}
