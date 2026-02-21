import { narrate } from "../narrator.js";
import EventEmitter from "events";

/**
 * WhatsApp 어댑터 (Chapter 3)
 * Baileys 라이브러리를 사용하여 WhatsApp Web 연결을 시뮬레이션합니다.
 */
export async function startWhatsAppChannel(gateway: EventEmitter) {
  narrate({ 
    who: "startWhatsAppChannel", 
    role: "눈과 귀 (WhatsApp)", 
    action: "WhatsApp 어댑터 가동 시작" 
  });

  // 1. [기억 장치] 세션 정보 로드 (시뮬레이션)
  console.log("[WhatsApp] Loading auth state from auth_info_baileys...");

  // 2. [무전기 켜기] 연결 수립 (시뮬레이션)
  console.log("[WhatsApp] Connecting to WhatsApp servers...");
  
  // 3. [보고] 연결 성공 알림
  narrate({ 
    who: "WhatsApp", 
    role: "눈", 
    action: "WhatsApp 연결 완료 (QR 코드 스캔 성공)", 
    friend: "Gateway" 
  });

  // 4. [경청하기] 가상의 메시지 수신 시나리오
  const simulateIncomingMessage = (from: string, text: string) => {
    narrate({ 
      who: "WhatsApp", 
      role: "귀", 
      action: "새 메시지 수신 (Normalization)", 
      friend: from 
    });

    const normalizedMsg = {
      from,
      text,
      timestamp: Date.now(),
      platform: "whatsapp"
    };

    // 5. [사령부 보고] Gateway로 메시지 전달
    gateway.emit("incoming_message", normalizedMsg);
  };

  // 테스트를 위해 5초 후 가짜 메시지 발생
  setTimeout(() => simulateIncomingMessage("821012345678@s.whatsapp.net", "안녕! 몰트봇, 오늘 날씨 어때?"), 5000);

  return {
    sendMessage: async (jid: string, text: string) => {
      console.log(`[WhatsApp] Sending message to ${jid}: ${text}`);
      narrate({ 
        who: "WhatsApp", 
        role: "팔", 
        action: "메시지 전송 성공", 
        friend: jid 
      });
    }
  };
}
