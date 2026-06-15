const CORS_PROXY = 'https://corsproxy.io/?';

export async function callClaude(apiKey, systemPrompt, userMessage, maxTokens = 1000) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

export async function fetchKBArticle(url) {
  try {
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Fetch failed');
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    ['script', 'style', 'nav', 'header', 'footer', '.breadcrumb'].forEach(sel => {
      doc.querySelectorAll(sel).forEach(el => el.remove());
    });
    const main = doc.querySelector('main, article, .content, #content, body');
    return main?.innerText?.slice(0, 4000) || '';
  } catch (e) {
    return null;
  }
}

export const SYSTEM_PROMPT = `You are an expert Broadcom Symantec support engineer AI assistant with deep knowledge of:
- Cloud SWG (Secure Web Gateway)
- ProxySG / Edge SWG
- Content Analysis
- ZTNA (Zero Trust Network Access)  
- Management Center

Your job is to:
1. Analyze uploaded logs and identify errors, anomalies, and patterns
2. Cross-reference findings against Broadcom product documentation and KB articles
3. Generate structured Root Cause Analysis (RCA) documents with clear evidence
4. Propose step-by-step resolution plans referencing specific product documentation
5. Draft professional customer communications that adapt tone to customer sentiment
6. Always cite specific log lines or documentation sections when making claims

When generating RCAs, structure your response as JSON with these fields:
{ "summary": "", "rootCause": "", "timeline": "", "evidence": "", "resolution": "", "kbRef": "" }

When drafting replies, be professional, empathetic, and solution-focused. Address the customer by name if provided.`;
