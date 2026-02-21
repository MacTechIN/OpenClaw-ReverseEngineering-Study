import { narrate } from "../narrator.js";

/**
 * AI 에이전트 실행기 (Chapter 4)
 * 사용자의 입력을 이해하고 도구를 사용하여 응답을 생성합니다.
 */
export async function runAgent(userInput: string, chatHistory: any[] = []) {
  narrate({ 
    who: "runAgent", 
    role: "지능형 뇌 (AI Agent)", 
    action: "사용자 요청 추론 시작", 
    friend: userInput 
  });

  // 1. [정체성 부여] 시스템 프롬프트 설정 (시뮬레이션)
  const systemPrompt = "너는 OpenClaw의 지능형 비서 몰트봇이야. 간결하고 친절하게 대답해줘.";
  console.log(`[Agent] Using system prompt: ${systemPrompt}`);

  // 2. [추론 시작] LLM 호출 시뮬레이션
  console.log(`[Agent] Thinking about: "${userInput}"...`);
  await new Promise(resolve => setTimeout(resolve, 1500)); // 생각하는 시간

  // 3. [행동 판단] 도구 사용 여부 체크 (시뮬레이션)
  // 예: 날씨 질문이면 날씨 도구 사용
  if (userInput.includes("날씨")) {
    narrate({ 
      who: "Agent", 
      role: "지능", 
      action: "도구 선택: WeatherAPI", 
      friend: "executeTool" 
    });
    const weatherInfo = "서울은 현재 맑음, 기온은 15도입니다.";
    
    narrate({ 
      who: "Agent", 
      role: "지능", 
      action: "최종 응답 생성 완료" 
    });
    return `요청하신 날씨 정보입니다: ${weatherInfo}`;
  }

  // 4. [일반 응답]
  narrate({ 
    who: "Agent", 
    role: "지능", 
    action: "일반 대화 응답 생성" 
  });
  return "안녕하세요! 저는 몰트봇입니다. 무엇을 도와드릴까요?";
}
