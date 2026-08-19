import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/db";
import { shipments } from "@/db/schema";

const createShipmentSchema = z.object({
  trackingNumber: z.string().trim().min(3).max(64),
  origin: z.string().trim().min(1).max(255),
  destination: z.string().trim().min(1).max(255),
  notes: z.string().trim().max(2000).optional(),
});

export async function GET() {
  try {
    const rows = await getDb()
      .select()
      .from(shipments)
      .orderBy(desc(shipments.createdAt));

    return NextResponse.json({ shipments: rows });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch shipments";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = createShipmentSchema.parse(await request.json());

    const [shipment] = await getDb()
      .insert(shipments)
      .values({
        trackingNumber: body.trackingNumber,
        origin: body.origin,
        destination: body.destination,
        notes: body.notes,
      })
      .returning();

    return NextResponse.json({ shipment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid request body" },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to create shipment";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
