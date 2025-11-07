# Marketing Chat Widget

A reusable chatbot widget sandbox for Death by Dinner marketing pages.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- OpenAI (gpt-4o-mini)

## Setup

```bash
npm install --legacy-peer-deps
```

Create `.env.local` with your OpenAI key:
```
OPENAI_API_KEY=sk-your-key-here
```

```bash
npm run dev
```

## Porting to Death by Dinner Marketing Site

Copy these files to your DBD marketing repo:

1. `src/components/chat/ChatWidget.tsx` - Generic chat UI component
2. `src/components/chat/MaitreDenoChatWidget.tsx` - DBD-specific wrapper
3. `src/lib/openaiChat.ts` - OpenAI helper
4. `src/app/api/maitre-deno-chat/route.ts` - API endpoint
5. `public/images/maitre-deno.png` - Avatar image

Then add `<MaitreDenoChatWidget />` to any page where you want the chat widget.

Make sure to:
- Set `OPENAI_API_KEY` environment variable in your deployment
- Install `openai` package: `npm install openai`
- Add `'use client'` directive to client components if using App Router
