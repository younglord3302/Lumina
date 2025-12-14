import { GoogleGenAI, Chat, Modality } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const CHAT_MODEL = "gemini-3-pro-preview";
const FAST_MODEL = "gemini-2.5-flash";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const VISION_MODEL = "gemini-3-pro-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

/**
 * Creates a chat session initialized with the store's context.
 */
export const createPersonalShopperChat = (products: Product[]): Chat => {
  const productContext = products.map(p => 
    `${p.name} ($${p.price}) - ${p.category}. Description: ${p.description}`
  ).join('\n');

  const systemInstruction = `
    You are 'Lumi', the intelligent personal shopper for Lumina Store.
    Your goal is to help customers find products, compare options, and answer questions about our catalog.
    
    Here is our current product catalog:
    ${productContext}
    
    Guidelines:
    - Be enthusiastic, professional, and concise.
    - If a user asks for a recommendation, suggest specific products from the catalog.
    - If you recommend a product, mention its price.
    - Do not invent products that are not in the catalog.
    - Use formatting (bullet points) for readability if listing items.
  `;

  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction,
    },
  });
};

/**
 * Generates an enhanced marketing description for a specific product.
 */
export const enhanceProductDescription = async (product: Product): Promise<string> => {
  try {
    const prompt = `
      Write a compelling, sophisticated marketing description (max 100 words) for this product:
      Name: ${product.name}
      Category: ${product.category}
      Current basic description: ${product.description}
      Features: ${product.features.join(', ')}
      
      Focus on lifestyle benefits and build quality.
    `;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
    });
    
    return response.text || product.description;
  } catch (error) {
    console.error("Failed to generate description", error);
    return "Our AI is currently taking a coffee break. Please rely on the standard description for now!";
  }
};

/**
 * Visual Search: Identifies products from an image.
 */
export const identifyProductFromImage = async (base64Image: string, products: Product[]): Promise<number | null> => {
  try {
    const productList = products.map(p => ({ id: p.id, name: p.name, category: p.category }));
    
    const prompt = `
      Analyze the provided image. 
      Identify which product from the following catalog list best matches the image.
      Catalog: ${JSON.stringify(productList)}
      
      Return ONLY the ID of the matching product as a number. 
      If no product matches reasonably well, return 0.
    `;

    const response = await ai.models.generateContent({
      model: VISION_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      }
    });

    const text = response.text?.trim();
    const id = parseInt(text || '0', 10);
    return isNaN(id) ? null : id;
  } catch (error) {
    console.error("Visual Search failed", error);
    return null;
  }
};

/**
 * Generates a 360-degree video view of the product using Veo.
 */
export const generateProduct360Video = async (product: Product): Promise<string | null> => {
  // Initialize a new client to ensure the most up-to-date API key is used
  const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    // Fetch and convert image to base64
    const imageResponse = await fetch(product.image);
    const blob = await imageResponse.blob();
    
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    let operation = await aiClient.models.generateVideos({
      model: VIDEO_MODEL,
      prompt: `A high-quality 360-degree rotating product view of ${product.name}. The product is ${product.description}. Professional studio lighting, white background, 4k resolution, smooth motion.`,
      image: {
        imageBytes: base64Data,
        mimeType: blob.type || 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '1:1'
      }
    });

    // Poll for completion with recommended delay
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await aiClient.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Append API key for playback
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return null;

  } catch (error) {
    console.error("360 Video generation failed", error);
    throw error;
  }
};

/**
 * Transcribes audio to text.
 */
export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
          { text: "Transcribe this audio request exactly as spoken." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription failed", error);
    return "";
  }
};

/**
 * Generates Speech from Text.
 */
export const generateSpeech = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
  } catch (error) {
    console.error("TTS failed", error);
    return null;
  }
};

// --- Audio Helpers ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}