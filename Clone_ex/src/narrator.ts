import fs from 'fs';

// "해설자" 함수: 누가, 어디서, 누구에게 연락하는지 기록합니다.
export function narrate(info: {
  who: string;      // 함수 이름 (예: startGatewayServer)
  role: string;     // 역할 (예: 총사령관)
  action: string;   // 하는 일 (예: 심장 박동기 켜기)
  friend?: string;  // 연결 대상 (예: startHeartbeatRunner)
}) {
  const logMessage = `[${new Date().toISOString()}] 
  👤 WHO: ${info.who}
  🛡️ ROLE: ${info.role}
  🎬 ACTION: ${info.action}
  ${info.friend ? `🔗 CONTACT: ${info.friend}` : ""}
  --------------------------------------------------\n`;

  // 1. 화면에 보여주기
  console.log(logMessage);
  
  // 2. 파일에 기록하기 (learning.log)
  try {
    fs.appendFileSync('learning.log', logMessage);
  } catch (err) {
    console.error('Failed to write to learning.log:', err);
  }
}
