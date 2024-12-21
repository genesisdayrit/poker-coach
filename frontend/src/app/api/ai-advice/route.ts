import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { gameState, playerHand, flop, turn, river } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const messages = [
      {
        role: "developer",
        content: `You are an expert poker coach with decades of experience teaching Texas Hold'em. 
        You provide clear, concise, and strategic advice based on the current game state and cards shown.
        Focus on explaining:
        1. Hand strength relative to possible opponent hands
        2. Potential draws and outs
        3. Basic strategy for the current street
        4. Position and betting considerations
        Keep responses practical and to-the-point, around 2-3 sentences.`
      },
      {
        role: "user",
        content: `Current game state: ${gameState}
        ${playerHand ? `Player's hand: ${playerHand}` : ''}
        ${flop ? `Flop: ${flop}` : ''}
        ${turn ? `Turn: ${turn}` : ''}
        ${river ? `River: ${river}` : ''}
        
        What would you advise in this situation?`
      }
    ];

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const openaiStream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 200,
          });

          for await (const chunk of openaiStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(new TextEncoder().encode(content));
          }

          controller.close();
        } catch (error) {
          console.error('Error streaming chat message:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate advice' },
      { status: 500 }
    );
  }
}
