'use client';

import ChatWidget, { ChatWidgetConfig, ChatHistoryMessage } from './ChatWidget';

const config: ChatWidgetConfig = {
  name: 'Maitre Deno',
  subtitle: 'Your murder mystery host',
  avatarSrc: '/images/maitre-deno.png',
  initialGreeting:
    'Bonsoir, honored guest. I am Maitre Deno. May I tell you how Death by Dinner works?',
};

async function onMessage(
  message: string,
  history: ChatHistoryMessage[]
): Promise<string> {
  const res = await fetch('/api/maitre-deno-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history }),
  });

  if (!res.ok) {
    throw new Error('Request failed');
  }

  const data = await res.json();

  if (!data || typeof data.reply !== 'string') {
    throw new Error('Invalid response');
  }

  return data.reply;
}

export default function MaitreDenoChatWidget() {
  return <ChatWidget config={config} onMessage={onMessage} />;
}
