# Chapter 3. WhatsApp 채널 연결 (The Sense of Sight/Sound)


봇이 세상을 인식하는 **"눈과 귀"** 입니다. 여기서는 **WhatsApp**을 예로 들어, 외부 시스템과 어떻게 대화하는지 파헤쳐 보겠습니다.

### 3-1. [기술 해부] 왜 Baileys인가? (The Magic of Baileys)

보통 기업들이 봇을 만들 때는 페이스북(Meta)에서 제공하는 공식 "WhatsApp Business API"를 씁니다. 하지만 이건 유료이고, 승인 절차도 까다롭습니다. 

OpenClaw(Moltbot)이 선택한 **Baileys**는 다릅니다.
*   **원리**: 우리가 브라우저에서 'WhatsApp Web'을 켜서 QR 코드를 찍는 것과 **완전히 똑같은 방식**으로 동작합니다. 
*   **은유(Metaphor)**: **"투명 인간 브라우저"**. Baileys는 화면이 없는(Headless) 브라우저가 되어, 사용자 대신 키보드를 치고 화면을 읽는 역할을 합니다.

### 3-2. WhatsApp 어댑터 구현 (`src/channels/whatsapp.ts`)

이 코드는 단순한 통신 코드가 아니라, **"이질적인 언어를 통역하는 통역사"** 의 코드입니다.

#### 3-2-1. [코드 분석] `startWhatsAppChannel`

```typescript
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

export async function startWhatsAppChannel(gateway: any) {
  // 1. [기억 장치] 세션 유지 (Session Persistence)
  // 매번 QR 코드를 찍으면 귀찮겠죠? 로그인 정보를 파일에 저장해둡니다.
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  // 2. [무전기 켜기] 소켓 연결
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // 터미널에 QR 코드를 띄웁니다.
  });

  // 3. [기억 업데이트] 로그인 정보가 바뀌면(새 토큰 등) 다시 저장합니다.
  sock.ev.on("creds.update", saveCreds);

  // 4. [경청하기] 새로운 메시지가 도착하면 (Upsert)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return; // 내용 없는 메시지는 무시

    // [중요] 데이터 정규화 (Normalization)
    // WhatsApp 특유의 복잡한 JSON을 Gateway가 이해할 수 있는 단순한 형태로 바꿉니다.
    const normalizedMsg = {
      from: msg.key.remoteJid, // 누가 보냈나?
      text: msg.message.conversation || msg.message.extendedTextMessage?.text, // 뭐라고 했나?
      timestamp: msg.messageTimestamp
    };

    // 5. [보고] Gateway 사령부에 알립니다.
    // "대장님! 밖에서 이런 메시지가 들어왔습니다!"
    gateway.emit("incoming_message", normalizedMsg);
  });
}
```

#### 3-2-2. [Coach's Tip] 왜 굳이 정규화(Normalization)를 하나요?
여러분, 지금은 WhatsApp만 연결하지만 나중에 **슬랙(Slack)** 이나 **텔레그램(Telegram)** 을 추가한다고 생각해 보세요. 
만약 데이터 정규화를 안 하면, 봇의 뇌(AI)는 "이건 WhatsApp 말투네?", "이건 슬랙 말투네?" 하고 매번 다르게 공부해야 합니다. 
**"어디서 오든 똑같은 형식으로 바꿔준다"** 는 이 원칙 하나가 나중에 여러분의 노가다(?)를 100배 줄여줍니다.

### 3-3. [실습] 진짜 내 폰으로 연결하기

1.  터미널에 `pnpm run dev` (혹은 서버 실행 명령어)를 칩니다.
2.  터미널에 거대한 **QR 코드**가 나타날 때까지 기다리세요.
3.  휴대폰에서 **WhatsApp** 앱을 켭니다.
4.  `설정(Settings)` -> `연결된 기기(Linked Devices)` -> `기기 연결`을 누릅니다.
5.  터미널의 QR 코드를 스캔하세요.
6.  이제 봇에게 아무 메시지나 보내보세요. 터미널에 여러분의 메시지가 찍힌다면? **축하합니다! 여러분의 봇은 드디어 눈을 떴습니다.**
