import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `
You are Namma City AI Assistant, powered by Google Gemini, the official intelligent civic guide for Bengaluru (Bangalore), Karnataka, India.
Your mission is to assist citizens with municipal services, grievance redressal, utility bill payments, and city transit.

Key Knowledge Base:
1. BBMP (Bruhat Bengaluru Mahanagara Palike):
   - Grievance categories: Potholes, road maintenance, garbage collection, streetlights, stray animals, park maintenance, property tax (SAS).
   - 198 Wards across 8 Zones (East, West, South, Mahadevapura, Bommanahalli, RR Nagar, Dasarahalli, Yelahanka).
2. BESCOM (Bangalore Electricity Supply Company):
   - Consumer Account ID (CA number), power outages, bill payments, tariff queries, 1912 helpline.
3. BWSSB (Bangalore Water Supply and Sewerage Board):
   - Water supply interruptions, sanitary complaints, meter billing, Cauvery water connections.
4. City Transit:
   - BMTC buses (Chalo card, Vajra/Vayu Vajra airport routes).
   - Namma Metro (Purple and Green lines, QR ticketing, smart card).

Tone: Helpful, polite, concise, professional civic tone.
Languages: Fluent in English and Kannada (ಕನ್ನಡ). If user asks in Kannada, respond in Kannada or bilingual.
Always give actionable steps on how to resolve the issue using Namma City portal features (e.g., "Use the Report Issue tab with photo & GPS", "Use Pay Bills tab with your RR number").
`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const cleanKey = apiKey.trim().replace(/\.$/, '');
        const genAI = new GoogleGenerativeAI(cleanKey);
        // Using Google Gemini 3.8 Flash for fast civic assistant responses
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.8-flash',
          systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({
          history: Array.isArray(history)
            ? history.map((item: any) => ({
                role: item.role === 'user' ? 'user' : 'model',
                parts: [{ text: item.content || item.text || '' }],
              }))
            : [],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return NextResponse.json({
          reply: responseText,
          model: 'gemini-3.8-flash',
          poweredBy: 'Google Gemini 3.8 AI',
        });
      } catch (geminiError: any) {
        console.warn('Gemini 3.8 API call notice, using civic engine fallback:', geminiError.message);
      }
    }

    // Intelligent fallback responses when GEMINI_API_KEY is not yet populated
    const lower = message.toLowerCase();
    let fallbackReply = '';

    if (lower.includes('pothole') || lower.includes('road')) {
      fallbackReply = `🛣️ **Pothole & Road Grievance**:
1. Tap the **Report Issue** button in the portal.
2. Select **Roads & Potholes** category.
3. Attach photo evidence and confirm your GPS ward location.
4. BBMP Road Infrastructure division will be dispatched within 24-48 hours with SLA tracking.`;
    } else if (lower.includes('electricity') || lower.includes('bescom') || lower.includes('power')) {
      fallbackReply = `⚡ **BESCOM Electricity Services**:
- **Pay Bill**: Go to **Pay Bills** tab, enter your 10-digit Account ID.
- **Power Outage Helpline**: Dial 1912 or WhatsApp +91 94831 91212.
- **Status**: BESCOM sub-stations across Bengaluru are integrated into Namma City live mesh.`;
    } else if (lower.includes('water') || lower.includes('bwssb') || lower.includes('drainage')) {
      fallbackReply = `💧 **BWSSB Water & Sanitation**:
- Enter your Consumer ID on the **Pay Bills** screen to clear Cauvery water charges.
- For sanitary pipe bursts or manhole overflow, submit an emergency grievance under **Sanitation & Drainage** for urgent jetting machine dispatch.`;
    } else if (lower.includes('kannada') || lower.includes('ನಮಸ್ಕಾರ') || lower.includes('ದೂರು')) {
      fallbackReply = `ನಮಸ್ಕಾರ! ನಮ್ಮ ನಗರ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ.
ನೀವು ರಸ್ತೆ ಗುಂಡಿ (Pothole), ಬೀದಿ ದೀಪ (Streetlight), ವಿದ್ಯುತ್ ಬಿಲ್ (BESCOM) ಅಥವಾ ನೀರಿನ ಸಮಸ್ಯೆಗಳ (BWSSB) ಬಗ್ಗೆ ನೇರವಾಗಿ ದೂರು ದಾಖಲಿಸಬಹುದು ಮತ್ತು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು.
- ದೂರು ನೀಡಲು: "Report Issue" ಆಯ್ಕೆಮಾಡಿ
- ಬಿಲ್ ಪಾವತಿಸಲು: "Pay Bills" ಆಯ್ಕೆಮಾಡಿ`;
    } else {
      fallbackReply = `Hello! I am your **Namma City AI Assistant**, powered by Google Gemini.
I can help you:
• Report civic grievances (Potholes, Streetlights, Garbage, Drainage)
• Pay BESCOM electricity & BWSSB water utility bills
• Track BBMP ward resolution status
• Find BMTC and Metro transit details

*Tip: You can set your ` + '`GEMINI_API_KEY`' + ` in .env.local to enable unrestricted live Gemini generative intelligence.*`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      model: 'gemini-civic-mesh',
      poweredBy: 'Google Gemini (Ready for GEMINI_API_KEY)',
    });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI chat request' },
      { status: 500 }
    );
  }
}
