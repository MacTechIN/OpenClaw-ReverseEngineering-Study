/**
 * OpenClaw 제어 패널 (Chapter 5)
 * Lit을 사용하여 웹 컴포넌트 기반으로 제작되었습니다.
 */
// Lit 라이브러리는 런타임에 브라우저에서 로드된다고 가정합니다.
// 여기서는 핵심 로직 스켈레톤만 구현합니다.

export class MoltbotApp {
  messages: string[] = [];
  ws: any = null;

  constructor() {
    console.log("🎨 OpenClaw Face: UI Component Initialized");
    this.connectGateway();
  }

  // [신경 연결] 게이트웨이 서버와 실시간 통화 시작
  connectGateway() {
    const host = window.location.host;
    console.log(`🔗 Connecting to Gateway at ws://${host}`);
    
    // 시뮬레이션: 실제 WebSocket 대신 가짜 핸들러
    this.ws = {
      onmessage: (event: any) => {
        const msg = JSON.parse(event.data);
        this.addLog(msg.text);
      }
    };
  }

  // [그리기] 로그 창에 메시지 추가
  addLog(msg: string) {
    this.messages.push(msg);
    this.render();
  }

  // [렌더링 시뮬레이션]
  render() {
    console.clear();
    console.log("--- OpenClaw Control Panel ---");
    this.messages.forEach(m => console.log(`> ${m}`));
    console.log("------------------------------");
  }
}

// 앱 실행
new MoltbotApp();
