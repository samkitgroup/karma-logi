import { isWithinVenueRadius, VENUE_RADIUS_M } from "@/lib/geofence";

export type LocationCheckResult =
  | { ok: true; lat: number; lng: number }
  | { ok: false; message: string };

type GeolocationPositionErrorCode = 1 | 2 | 3;

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12_000,
      maximumAge: 0,
    });
  });
}

function messageForError(code: GeolocationPositionErrorCode): string {
  switch (code) {
    case 1:
      return "Location access is required to play at the venue. Allow location in your browser and try again.";
    case 2:
      return "Unable to read your location. Check GPS/network and try again.";
    case 3:
      return "Location request timed out. Try again near a window or outdoors.";
    default:
      return "Unable to verify your location. Try again.";
  }
}

export async function verifyVenueLocation(): Promise<LocationCheckResult> {
  try {
    const position = await getPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (!isWithinVenueRadius(lat, lng)) {
      return {
        ok: false,
        message: `You must be within ${VENUE_RADIUS_M}m of the venue to play.`,
      };
    }

    return { ok: true, lat, lng };
  } catch (error) {
    if (error instanceof GeolocationPositionError) {
      return {
        ok: false,
        message: messageForError(error.code as GeolocationPositionErrorCode),
      };
    }

    if (error instanceof Error && error.message === "unsupported") {
      return {
        ok: false,
        message: "Location is not supported on this device or browser.",
      };
    }

    return {
      ok: false,
      message: "Unable to verify your location. Try again.",
    };
  }
}
