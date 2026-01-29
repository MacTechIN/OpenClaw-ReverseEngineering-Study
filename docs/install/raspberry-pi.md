# 라즈베리파이 5 (8GB) Moltbot 설치 매뉴얼

이 문서는 **Raspberry Pi 5 (8GB 모델)** 환경에서 **Moltbot (Clawdbot)** 프로젝트를 설치하고 실행하기 위한 상세 가이드입니다.

프로젝트 분석 결과, 해당 프로젝트는 **Docker**를 통한 배포가 가장 적합하며, `docker-setup.sh` 스크립트를 통해 설치 과정을 자동화할 수 있도록 구성되어 있습니다. 특히 ARM 아키텍처(라즈베리파이) 호환성을 고려한 빌드 설정이 이미 포함되어 있어 원활한 설치가 예상됩니다.

---

## 1. 사전 준비 사항 (Prerequisites)

### 하드웨어 권장 사양
- **기기**: Raspberry Pi 5
- **메모리**: 8GB (권장)
- **스토리지**: 최소 32GB 이상의 마이크로 SD 카드 또는 NVMe SSD (권장)
- **인터넷**: 유선 랜 또는 안정적인 Wi-Fi 연결

### 운영체제 (OS)
- **OS**: **Raspberry Pi OS (64-bit)**
  > ⚠️ 주의: 반드시 **64-bit** 버전을 사용해야 합니다. 32-bit OS에서는 Node.js 및 Docker 빌드가 원활하지 않을 수 있습니다.

---

## 2. 필수 소프트웨어 설치

터미널을 열고 다음 명령어들을 차례로 실행하여 시스템을 업데이트하고 필요한 도구(Git, Docker)를 설치합니다.

### 2.1 시스템 업데이트
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Docker 및 Git 설치
라즈베리파이용 공식 Docker 설치 스크립트를 사용하는 것이 가장 간편합니다.

```bash
# Docker 설치 스크립트 다운로드 및 실행
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 현재 사용자(pi)를 Docker 그룹에 추가 (sudo 없이 docker 명령어 사용 위함)
sudo usermod -aG docker $USER

# 변경 사항 적용을 위해 로그아웃 후 다시 로그인 (또는 시스템 재부팅)
# 재부팅 권장:
sudo reboot
```

재부팅 후 Docker가 정상적으로 설치되었는지 확인합니다:
```bash
docker version
docker compose version
```

### 2.3 (선택 사항) Python 의존성 설치
Moltbot의 일부 스킬(`skills/local-places` 등)은 Python 환경을 필요로 합니다. 이러한 기능을 사용하려면 프로젝트 루트에 있는 `requirements.txt`를 사용하여 의존성을 설치하세요.

```bash
# (선택 사항) 가상 환경 생성 및 활성화 권장
python3 -m venv .venv
source .venv/bin/activate

# 의존성 설치
pip install -r requirements.txt
```

---

## 3. Moltbot 프로젝트 설치

### 3.1 프로젝트 클론 (다운로드)
작업할 디렉토리로 이동하여 프로젝트를 다운로드합니다. (URL은 실제 저장소 주소로 변경 필요, 현재는 로컬 분석 기준)

```bash
# 홈 디렉토리로 이동
cd ~

# 프로젝트 클론 (예시 URL, 실제 깃허브 주소가 있다면 사용)
# 만약 개인 private 저장소라면 git clone 명령어를 적절히 수정하세요.
git clone <REPOSITORY_URL> moltbot
# 또는 현재 로컬 파일을 라즈베리파이로 복사하세요.

cd moltbot
```

### 3.2 설치 스크립트 실행
프로젝트 내에 포함된 `docker-setup.sh` 스크립트는 다음 작업을 자동으로 수행합니다:
1. 필수 디렉토리 생성
2. 보안 토큰 생성
3. Docker 이미지 빌드 (ARM64 호환성 자동 처리)
4. 초기 설정 마법사 실행

스크립트에 실행 권한을 부여하고 실행합니다:

```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

> **참고**: 라즈베리파이 5에서 Docker 이미지를 처음 빌드할 때 시간이 다소 소요될 수 있습니다 (약 5~15분). `CLAWDBOT_PREFER_PNPM=1` 옵션이 자동으로 적용되어 ARM 아키텍처 호환성 문제를 해결합니다.

---

## 4. 초기 설정 (Onboarding)

`docker-setup.sh` 실행 중 "Onboarding (interactive)" 단계가 나타나면 설정 마법사가 시작됩니다. 다음은 권장 설정값입니다:

1.  **Gateway bind**: `lan` (또는 외부 접속이 필요 없다면 `loopback`)
    *   라즈베리파이를 홈 서버로 쓴다면 `lan`을 선택하여 같은 네트워크의 다른 PC에서 접속 가능하게 하는 것이 좋습니다.
2.  **Gateway auth**: `token` (보안을 위해 토큰 인증 권장)
3.  **Tailscale exposure**: `Off` (초기 설정 시에는 끄고 나중에 필요시 설정)
4.  **Install Gateway daemon**: `No` (Docker 컨테이너로 관리하므로 데몬 설치는 `No` 선택)

---

## 5. 실행 및 확인

설치가 완료되면 게이트웨이가 자동으로 시작됩니다.

### 5.1 상태 확인
컨테이너가 정상적으로 실행 중인지 확인합니다.

```bash
docker compose ps
```
`clawdbot-gateway` 컨테이너의 상태가 `Up`이어야 합니다.

### 5.2 로그 확인
실시간 로그를 통해 오류가 없는지 확인합니다.

```bash
docker compose logs -f clawdbot-gateway
```
로그에 "Gateway listening..." 메시지가 보이면 정상 구동된 것입니다.

---

## 6. 문제 해결 (Troubleshooting)

### Q: 빌드 중 메모리 부족 오류가 발생합니다.
A: 라즈베리파이 5 8GB 모델에서는 충분하지만, 만약 다른 프로그램을 많이 실행 중이라면 Docker 빌드 시 스왑 메모리가 부족할 수 있습니다. 스왑 크기를 늘려보세요.
```bash
# /etc/dphys-swapfile 파일 수정
# CONF_SWAPSIZE=100 -> CONF_SWAPSIZE=2048 (2GB)
sudo nano /etc/dphys-swapfile
sudo /etc/init.d/dphys-swapfile restart
```

### Q: `bun` 관련 오류가 발생합니다.
A: Dockerfile은 ARM 아키텍처에서 `bun` 대신 `pnpm`을 사용하여 UI를 빌드하도록 이미 설정되어 있습니다(`ENV CLAWDBOT_PREFER_PNPM=1`). `docker-setup.sh`를 통해 설치하면 이 설정이 자동으로 적용되므로 스크립트를 통해 설치하는 것을 권장합니다.

### Q: `requirements.txt`는 꼭 설치해야 하나요?
A: 아니요, 기본 기능만 사용한다면 설치하지 않아도 됩니다. `local-places`와 같은 파이썬 기반의 확장 기능을 사용할 때만 필요합니다.

### Q: 외부에서 접속이 안 됩니다.
A: `docker-compose.yml` 또는 `.env` 설정에서 `CLAWDBOT_GATEWAY_BIND`가 `lan`으로 설정되어 있는지 확인하세요. 기본값인 `loopback`은 라즈베리파이 내부에서만 접속 가능합니다.
