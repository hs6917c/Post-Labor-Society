import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

// Helper to safely get the key
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const SYSTEM_INSTRUCTION = `
당신은 '노동 이후의 사회'라는 미래학 리포트를 작성하는 수석 연구원입니다.
사용자가 요청한 주제에 대해 깊이 있는 통찰력, 통계적 예측, 그리고 논리적인 설명을 제공해야 합니다.
톤앤매너는 전문적이고 분석적이지만, 대중이 이해하기 쉬워야 합니다.
가능한 경우, 미래 시나리오나 구체적인 예시를 들어 설명하세요.

또한, 설명하는 내용과 관련된 가상의 통계 데이터나 예측 데이터를 생성하여 시각화할 수 있도록 JSON 데이터를 함께 제공해야 합니다.
특히 'Project Society'나 '결론', '시나리오'와 관련된 주제의 경우 2035~2050년 사이의 타임라인 이벤트를 포함하는 것이 권장됩니다.
`;

export const generateSectionContent = async (
  title: string,
  subItems: string[]
): Promise<GeneratedContent> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    주제: ${title}
    세부 항목: ${subItems.join(', ')}

    위 주제에 대해 상세한 리포트 내용을 작성해주세요.
    내용은 Markdown 형식으로 작성되어야 하며, ## 소제목, **강조**, - 리스트 등을 적절히 활용하세요.
    
    1. 차트 데이터: 이 내용과 관련된 차트를 그리기 위한 데이터를 생성해주세요.
    2. 타임라인(선택사항): 만약 주제가 미래 시나리오, 역사적 흐름, 혹은 단계별 변화(예: 2035~2050)와 관련있다면 'timelineEvents' 필드에 연도별 핵심 사건을 포함해주세요.
    
    응답은 반드시 아래의 JSON 스키마를 따라야 합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            markdown: {
              type: Type.STRING,
              description: "The main content of the section in Markdown format."
            },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  group: { type: Type.STRING, nullable: true }
                }
              },
              description: "Data points for the chart. At least 5 data points."
            },
            chartType: {
              type: Type.STRING,
              enum: ["line", "bar", "pie", "area"],
              description: "The best type of chart to visualize this data."
            },
            chartTitle: {
              type: Type.STRING,
              description: "Title of the chart."
            },
            chartXLabel: {
              type: Type.STRING,
              description: "Label for the X axis (if applicable)."
            },
            chartYLabel: {
              type: Type.STRING,
              description: "Label for the Y axis (if applicable)."
            },
            timelineEvents: {
              type: Type.ARRAY,
              nullable: true,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING, description: "Year or Period (e.g. 2035)" },
                  title: { type: Type.STRING, description: "Event title" },
                  description: { type: Type.STRING, description: "Short description of the event" }
                }
              },
              description: "Optional list of timeline events for future scenarios."
            }
          },
          required: ["markdown"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      markdown: "## 오류 발생\n\n데이터를 불러오는 중 문제가 발생했습니다. API 키를 확인하거나 다시 시도해주세요.\n\n" + String(error),
    };
  }
};

export const evaluateProjectIdea = async (skill: string, interest: string): Promise<{
  projectName: string;
  description: string;
  energyCredits: number;
  reasoning: string;
}> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    사용자 정보:
    - 핵심 기술: ${skill}
    - 관심 분야: ${interest}

    '노동 이후의 사회'인 Project Society 모델에서 이 사용자가 수행할 수 있는 창의적이고 가치 있는 '프로젝트'를 제안해주세요.
    이 사회에서는 생존 노동이 사라지고, 인류의 지식 확장, 문화 창달, 타인 돕기, 탐험 등이 가치로 인정받아 '에너지 크레딧(EC)'으로 보상받습니다.
    
    1. 프로젝트 이름: 흥미롭고 미래지향적으로 작명
    2. 설명: 구체적으로 무엇을 하는 프로젝트인지 2~3문장
    3. 예상 에너지 크레딧 보상: 100~5000 EC 사이 (난이도와 사회적 기여도에 따라 책정)
    4. 선정 이유: 왜 이 프로젝트가 가치 있는지 설명

    응답은 JSON 포맷으로 주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING },
            description: { type: Type.STRING },
            energyCredits: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No text response");

  } catch (e) {
    return {
      projectName: "시스템 오류",
      description: "분석 중 오류가 발생했습니다.",
      energyCredits: 0,
      reasoning: "API 연결을 확인해주세요."
    };
  }
};