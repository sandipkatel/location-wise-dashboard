import { NextRequest, NextResponse } from "next/server";
import { parse } from "papaparse";
import { getCoordinates } from "@/lib/geocode";
import type { LocationData } from "@/types";

// In-memory storage (use database in production)
let globalLocationData: LocationData[] = [];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const text = await file.text();

    const result = await new Promise((resolve, reject) => {
      parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results),
        error: (error: any) => reject(error),
      });
    });

    const parsedData = result as { data: any[] };
    const locationMap = new Map<string, LocationData>();

    // Process CSV rows
    parsedData.data.forEach((row: any) => {
      const country = row.country || row.Country;
      const city = row.city || row.City;
      const value = parseFloat(row.value || row.Value || "1");

      if (!country && !city) return;

      const coords = getCoordinates(city, country);
      if (!coords) return;

      const key = `${country}-${city}`;

      if (locationMap.has(key)) {
        const existing = locationMap.get(key)!;
        existing.count = (existing.count || 0) + 1;
        existing.value = (existing.value || 0) + value;
      } else {
        locationMap.set(key, {
          country: country || "",
          city: city || "",
          lat: coords.lat,
          lng: coords.lng,
          value: value,
          count: 1,
        });
      }
    });

    globalLocationData = Array.from(locationMap.values());

    return NextResponse.json({
      success: true,
      message: "File uploaded and processed successfully",
      rowCount: globalLocationData.length,
      data: globalLocationData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: globalLocationData,
  });
}
