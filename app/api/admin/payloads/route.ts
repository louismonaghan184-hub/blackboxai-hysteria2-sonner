import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin"
import { ImplantGenerator } from "@/lib/implants/generator"
import { ImplantCompilationService } from "@/lib/implants/compilation-service"

let generator: ImplantGenerator | null = null
let compilationService: ImplantCompilationService | null = null

function getGenerator(): ImplantGenerator {
  if (!generator) {
    generator = new ImplantGenerator()
  }
  return generator
}

function getCompilationService(): ImplantCompilationService {
  if (!compilationService) {
    compilationService = new ImplantCompilationService()
  }
  return compilationService
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const gen = getGenerator()
    const configs = gen.listConfigs()
    const service = getCompilationService()
    const queue = service.getQueue()

    return NextResponse.json({
      configs,
      queue,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch payloads" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const body = await request.json()
    const gen = getGenerator()

    const config = await gen.generate(body)

    return NextResponse.json({
      success: true,
      config,
      message: "Payload generated",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate payload" },
      { status: 500 },
    )
  }
}
