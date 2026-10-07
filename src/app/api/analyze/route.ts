import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          error: "Request must use multipart/form-data.",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No resume file was provided.",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF files are supported.",
        },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume must be smaller than 5 MB.",
        },
        { status: 400 }
      );
    }

    // Convert uploaded PDF to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create PDF parser
    const parser = new PDFParse({
      data: buffer,
    });

    // Extract text
    const result = await parser.getText();

    // Free parser resources
    await parser.destroy();

    const extractedText = result.text.trim();

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No readable text was found in the PDF. The resume may be image-based or scanned.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume text extracted successfully.",
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      pages: result.total,
      text: extractedText,
      characters: extractedText.length,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to extract text from the uploaded resume.",
      },
      { status: 500 }
    );
  }
}