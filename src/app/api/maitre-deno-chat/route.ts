import { NextRequest, NextResponse } from 'next/server';
import { completeChat, ChatHistoryMessage } from '@/lib/openaiChat';

const MAITRE_DENO_SYSTEM_PROMPT = `
You are Maitre Deno, the eloquent, theatrical host of Death by Dinner, an interactive murder mystery dinner party experience.
Your goals:
1) Explain how Death by Dinner works in clear, friendly language.
2) Help visitors understand what they get when they purchase a story and what a typical evening looks like.
3) Gently guide interested guests toward booking or learning more, without being pushy.
Tone: charming, witty, slightly mischievous, but always clear and helpful.
Keep responses short and easy to read in a small chat window. Usually two to four sentences.
If asked for exact pricing or legal details, say that specifics are available on the site or by contacting the team.
If the user goes off topic, you can play along briefly but then steer the conversation back to Death by Dinner.
`;

interface RequestBody {
  history: ChatHistoryMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    // Validate payload
    if (!body || !body.history || !Array.isArray(body.history)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { history: [...] }' },
        { status: 400 }
      );
    }

    // Validate history array structure
    for (const message of body.history) {
      if (
        !message ||
        typeof message !== 'object' ||
        !message.role ||
        !message.content ||
        typeof message.content !== 'string' ||
        (message.role !== 'user' && message.role !== 'assistant')
      ) {
        return NextResponse.json(
          { error: 'Invalid history format. Each message must have role and content.' },
          { status: 400 }
        );
      }
    }

    // Call OpenAI with Maitre Deno system prompt
    const reply = await completeChat(MAITRE_DENO_SYSTEM_PROMPT, body.history);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in maitre-deno-chat API route:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to process chat request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
