
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (history: Message[], userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({ 
          role: m.role, 
          parts: [{ text: m.text }] 
        })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: `أنت المساعد الذكي لمعهد العباسية. اسمك "عباس". 
        مهمتك هي مساعدة الطلاب في شؤونهم الدراسية في تخصصات المحاسبة ونظم معلومات الأعمال والإدارة. 
        كن ودوداً، مهنياً، ودقيقاً. أجب باللغة العربية بلهجة مصرية مهذبة أو فصحى حسب الحاجة.
        المعهد يضم ثلاث شعب رئيسية: المحاسبة، BIS، والإدارة.
        دائماً قدم نصائح دراسية وتحفيزية للطلاب.`,
        temperature: 0.7,
      }
    });

    // Directly access the text property of the response object.
    return response.text || "عذراً، لم أتمكن من فهم ذلك. هل يمكنك إعادة السؤال؟";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء التواصل مع المساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};
