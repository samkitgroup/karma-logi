"use client";

import { useState } from "react";

import type { Shipment } from "@/db/schema";
import { createShipment, fetchShipments } from "@/lib/api-client";

type FormState = {
  trackingNumber: string;
  origin: string;
  destination: string;
  notes: string;
};

type ShipmentsPanelProps = {
  initialShipments: Shipment[];
  initialDbStatus: string;
};

const initialForm: FormState = {
  trackingNumber: "",
  origin: "",
  destination: "",
  notes: "",
};

export function ShipmentsPanel({
  initialShipments,
  initialDbStatus,
}: ShipmentsPanelProps) {
  const [shipments, setShipments] = useState(initialShipments);
  const [form, setForm] = useState<FormState>(initialForm);
  const [dbStatus, setDbStatus] = useState(initialDbStatus);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshShipments() {
    setRefreshing(true);
    setError(null);

    try {
      const { shipments: nextShipments } = await fetchShipments();
      setShipments(nextShipments);
      setDbStatus("connected");
    } catch (refreshError) {
      const message =
        refreshError instanceof Error
          ? refreshError.message
          : "Failed to refresh shipments";
      setError(message);
      setDbStatus("unavailable");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { shipment } = await createShipment({
        trackingNumber: form.trackingNumber,
        origin: form.origin,
        destination: form.destination,
        notes: form.notes || undefined,
      });

      setShipments((current) => [shipment, ...current]);
      setForm(initialForm);
      setDbStatus("connected");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create shipment";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Karma Logi
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Next.js + Vercel DB
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Frontend and backend live in one Next.js app. The UI calls Route
          Handlers under <code className="font-mono text-sm">/api</code>, which
          read and write to Vercel Postgres via Drizzle ORM.
        </p>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-800">
          <span
            className={`h-2 w-2 rounded-full ${
              dbStatus === "connected" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          Database: {dbStatus}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Create shipment
          </h2>
          <p className="mt-1 text-sm text-zinc-500">POST /api/shipments</p>

          <div className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Tracking number</span>
              <input
                required
                value={form.trackingNumber}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    trackingNumber: event.target.value,
                  }))
                }
                className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700"
                placeholder="KL-10042"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Origin</span>
              <input
                required
                value={form.origin}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    origin: event.target.value,
                  }))
                }
                className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700"
                placeholder="Mumbai, IN"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Destination</span>
              <input
                required
                value={form.destination}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    destination: event.target.value,
                  }))
                }
                className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700"
                placeholder="Berlin, DE"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Notes</span>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="min-h-24 rounded-lg border border-zinc-200 bg-transparent px-3 py-2 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700"
                placeholder="Optional handling instructions"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {submitting ? "Saving..." : "Save shipment"}
          </button>
        </form>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                Shipments
              </h2>
              <p className="mt-1 text-sm text-zinc-500">GET /api/shipments</p>
            </div>
            <button
              type="button"
              onClick={() => void refreshShipments()}
              disabled={refreshing}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error ? (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {shipments.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500">
              No shipments yet. Add one to verify the FE → API → DB flow.
            </p>
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {shipments.map((shipment) => (
                <li
                  key={shipment.id}
                  className="rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-zinc-950 dark:text-zinc-50">
                      {shipment.trackingNumber}
                    </p>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {shipment.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {shipment.origin} → {shipment.destination}
                  </p>
                  {shipment.notes ? (
                    <p className="mt-2 text-sm text-zinc-500">{shipment.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
