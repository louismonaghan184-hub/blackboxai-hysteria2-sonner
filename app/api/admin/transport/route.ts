import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { TransportAdapterManager, TransportAdapterFactory } from "@/lib/transports/adapters"
import { MultiTransportFallback } from "@/lib/transports/fallback"
import type { ProtocolType } from "@/lib/transports/adapters"

let adapterManager: TransportAdapterManager | null = null

function getAdapterManager(): TransportAdapterManager {
  if (!adapterManager) {
    adapterManager = new TransportAdapterManager()
  }
  return adapterManager
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const manager = getAdapterManager()
    const adapters = manager.getAllAdapters()
    const stats = manager.getStatistics()

    return NextResponse.json({
      adapters,
      statistics: stats,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch transports" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const manager = getAdapterManager()

    const adapter = await manager.createAdapter(body)

    return NextResponse.json({
      success: true,
      adapter,
      message: "Transport adapter created",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create transport" },
      { status: 500 },
    )
  }
}
