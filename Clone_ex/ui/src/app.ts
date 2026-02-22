import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * OpenClaw 제어 패널 (Chapter 5)
 * Lit을 사용하여 웹 컴포넌트 기반으로 제작되었습니다.
 */
@customElement('moltbot-app')
export class MoltbotApp extends LitElement {
  @state() messages: string[] = [];

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
    .chat-window {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
      overflow: hidden;
    }
    h1 {
      background: #1e293b;
      color: white;
      margin: 0;
      padding: 12px;
      font-size: 1.25rem;
    }
    .log-list {
      height: 400px;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .log-item {
      background: white;
      padding: 8px;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      margin: 0;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  constructor() {
    super();
    console.log("🎨 OpenClaw Face: UI Component Initialized");
    this.connectGateway();
  }

  // [신경 연결] 게이트웨이 서버와 실시간 통화 시작
  connectGateway() {
    const host = window.location.host;
    console.log(`🔗 Connecting to Gateway at ws://${host}`);
    
    // 시뮬레이션: 3초 후에 첫 로그가 나타나도록 설정
    setTimeout(() => {
      this.addLog("시스템 기동 완료: 대기 중...");
    }, 1000);
  }

  // 로그 추가 및 리스트 관리
  addLog(msg: string) {
    this.messages = [...this.messages, msg];
  }

  render() {
    return html`
      <div class="chat-window">
        <h1>Moltbot 사령부 (Live Control)</h1>
        <div class="log-list">
          ${this.messages.map(m => html`<p class="log-item">> ${m}</p>`)}
        </div>
      </div>
    `;
  }
}
