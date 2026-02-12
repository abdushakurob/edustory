import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text, voice = "Idera" } = await request.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "No text provided" },
                { status: 400 },
            );
        }

        const apiKey = process.env.YARNGPT_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "TTS service not configured" },
                { status: 500 },
            );
        }

        // Call YarnGPT API
        const response = await fetch("https://yarngpt.ai/api/v1/tts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text.substring(0, 2000), // YarnGPT limit is 2000 chars
                voice,
                response_format: "mp3",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("YarnGPT error:", response.status, errorText);
            return NextResponse.json(
                { error: "Voice generation failed. Please try again." },
                { status: response.status },
            );
        }

        // Stream the audio back to the client
        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": audioBuffer.byteLength.toString(),
            },
        });
    } catch (error) {
        console.error("TTS error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "TTS failed" },
            { status: 500 },
        );
    }
}
