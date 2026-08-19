import type { NewShipment, Shipment } from "@/db/schema";

type ApiError = {
  error: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ApiError;

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? data.error
        : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function fetchShipments(): Promise<{ shipments: Shipment[] }> {
  const response = await fetch("/api/shipments", { cache: "no-store" });
  return parseJson(response);
}

export async function createShipment(
  input: Pick<NewShipment, "trackingNumber" | "origin" | "destination" | "notes">,
): Promise<{ shipment: Shipment }> {
  const response = await fetch("/api/shipments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson(response);
}
