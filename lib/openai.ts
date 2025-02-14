"use server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ParsedItem {
  description: string;
  unit: string;
  quantity: number;
  estimatedRate: number;
}

export async function parseProjectItems(itemsText: string): Promise<ParsedItem[]> {
  try {
    console.log(itemsText);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that parses construction project items into structured data. 
          Parse the input into a JSON object with an "items" array. Each item should have:
          - id: number (S. No. of the item)
          - description: string (detailed work description)
          - unit: string (measurement unit like sqm, cum, kg)
          - quantity: number (must be positive, up to 2 decimal places)
          - estimatedRate: number (must be positive, up to 2 decimal places in INR)
          
          Example response format:
          {
            "items": [
              {
                "id" : 1, 
                "description": "Excavation work for foundation",
                "unit": "cum",
                "quantity": 45.50,
                "estimatedRate": 150.75
              }
            ]
          }`
        },
        {
          role: "user",
          content: itemsText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    console.log("Response: ", response.choices[0].message.content); 

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!Array.isArray(result.items)) {
      throw new Error("Invalid response format from GPT");
    }

    // Type guard for item structure
    interface GPTItem {
      description: string;
      unit: string;
      quantity: number;
      estimatedRate: number;
    }

    // Validate and clean the data
    const parsedItems = result.items.map((item: unknown) => {
      const gptItem = item as GPTItem;
      if (!gptItem.description || !gptItem.unit || 
          typeof gptItem.quantity !== 'number' || typeof gptItem.estimatedRate !== 'number') {
        throw new Error("Invalid item structure");
      }
      
      return {
        description: String(gptItem.description),
        unit: String(gptItem.unit),
        quantity: Number(parseFloat(gptItem.quantity.toFixed(2))),
        estimatedRate: Number(parseFloat(gptItem.estimatedRate.toFixed(2)))
      };
    });
    console.log("Parsed items: ", parsedItems);

    // Validate all required fields are present and numbers are positive
    if (!parsedItems.every((item: ParsedItem) => 
      item.description && 
      item.unit && 
      item.quantity > 0 && 
      item.estimatedRate > 0
    )) {
      throw new Error("Invalid item data");
    }

    console.log("Parsed items: ", parsedItems);

    return parsedItems;
  } catch (error) {
    console.error('Error parsing project items:', error);
    throw new Error('Failed to parse project items');
  }
} 