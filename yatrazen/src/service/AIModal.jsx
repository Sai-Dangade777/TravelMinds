/**
 * AI chat service using OpenRouter.ai
 * Implements an interface compatible with your existing code
 */

// Add error handling for missing API key
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("OpenRouter API key is missing! Check your .env.local file");
}

/**
 * OpenRouter.ai chat session
 * Interface compatible with your existing Google Gemini AI code
 */
export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      // Ensure API key is properly formatted (no 'sk-orc-' prefix confusion)
      const cleanApiKey = apiKey.startsWith('sk-or-') 
        ? apiKey 
        : apiKey.replace('sk-orc-', 'sk-or-');

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,  // Dynamic referrer based on current domain
          'X-Title': 'YatraZen Trip Planner'
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku", // Most affordable but good model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenRouter API error details:", errorData);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        response: {
          text: () => data.choices[0].message.content
        }
      };
    } catch (error) {
      console.error("Error calling OpenRouter API:", error);
      throw error;
    }
  }
};