import { NextRequest, NextResponse } from "next/server";
import { parse } from "papaparse";

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

    // Read file content
    const text = await file.text();

    // Parse CSV
    const result = await new Promise((resolve, reject) => {
      parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results : any) => resolve(results),
        error: (error : any) => reject(error),
      });
    });

    const parsedData = result as { data: any[] };

    // Here you can:
    // 1. Validate the data
    // 2. Save to database
    // 3. Process the data
    // 4. Send to another service

    console.log("CSV Data:", parsedData.data);
    console.log("Row count:", parsedData.data.length);

    // Example: Send to external backend
    // const backendResponse = await fetch('https://your-backend.com/api/data', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(parsedData.data),
    // });

    return NextResponse.json({
      success: true,
      message: "File uploaded and processed successfully",
      rowCount: parsedData.data.length,
      data: parsedData.data.slice(0, 5), // Return first 5 rows as preview
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process file" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
