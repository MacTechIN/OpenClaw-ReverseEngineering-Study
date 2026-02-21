import { narrate } from "../narrator.js";

export function createChannelManager() {
  narrate({ 
    who: "createChannelManager", 
    role: "사장실 비서", 
    action: "팔다리(Messenger Channels) 관리자 임명" 
  });

  return {
    sendMessage: async (msg: string) => {
      narrate({ 
        who: "ChannelManager", 
        role: "팔", 
        action: "메시지 발송", 
        friend: "Messenger-API" 
      });
      console.log(`[Limbs] Sending: ${msg}`);
    },
    connect: async () => {
      narrate({ 
        who: "ChannelManager", 
        role: "다리", 
        action: "외부 서비스 연결" 
      });
      console.log("[Limbs] Ready to move!");
    }
  };
}
