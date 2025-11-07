import OpenAI from 'openai';

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function completeChat(
  systemPrompt: string,
  history: ChatHistoryMessage[]
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  const openai = new OpenAI({
    apiKey,
  });

  // Build messages array with system prompt followed by history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...history,
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply || typeof reply !== 'string' || reply.trim() === '') {
      throw new Error('No valid response received from OpenAI');
    }

    return reply;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }
    throw new Error('OpenAI API call failed with unknown error');
  }
}
