import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { TaskOrchestrationEngine } from "@/lib/orchestration/engine"

let engine: TaskOrchestrationEngine | null = null

function getEngine(): TaskOrchestrationEngine {
  if (!engine) {
    engine = new TaskOrchestrationEngine()
  }
  return engine
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const e = getEngine()
    const operations = e.listOperations()
    const stats = e.getStatistics()

    return NextResponse.json({
      operations,
      statistics: stats,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch coordination data" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const e = getEngine()

    const operation = await e.createOperation(body)

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
