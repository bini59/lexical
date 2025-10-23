# Lexical Editor Example

Lexical 에디터의 React 예제 프로젝트입니다. HTML Import/Export 기능과 커스텀 이미지 노드를 포함합니다.

## 📋 프로젝트 구조

```
lexical/
├── src/
│   ├── nodes/
│   │   └── ImageNode.jsx          # 커스텀 이미지 DecoratorNode
│   ├── plugins/
│   │   ├── LoadHTMLPlugin.jsx     # HTML → Lexical 변환
│   │   ├── OnChangePlugin.jsx     # Lexical → HTML 변환
│   │   └── ImagePlugin.jsx        # 이미지 삽입 명령어
│   ├── App.jsx                     # 메인 앱 컴포넌트
│   ├── Editor.jsx                  # 에디터 래퍼 컴포넌트
│   ├── main.jsx                    # React 엔트리포인트
│   └── index.css                   # 스타일시트
├── index.html
├── package.json
└── vite.config.js
```

## 🏗️ 아키텍처

### 컴포넌트 역할

1. **User/External**: 초기 HTML 제공, 사용자 입력, 변경된 HTML 수신
2. **LexicalComposer**: 에디터 설정 및 Context 제공
3. **Plugins**: 기능 확장 및 상태 관리
   - LoadHTMLPlugin: HTML → Lexical 노드 변환
   - OnChangePlugin: 변경 감지 및 HTML 추출
   - ImagePlugin: 이미지 삽입 명령어 등록
4. **Lexical Core**: 노드 트리 상태 관리 및 변환
5. **Nodes**: 데이터 모델 (ImageNode, ParagraphNode 등)
6. **Browser DOM**: 실제 렌더링

### 데이터 흐름

```
사용자 → LexicalComposer → Plugins → Lexical Core → Nodes → Browser DOM
```

#### 1️⃣ 초기 로딩 (HTML → Lexical)
```
HTML String → DOMParser → DOM → $generateNodesFromDOM() → Lexical Nodes → EditorState
```

#### 2️⃣ 렌더링 (Lexical → DOM)
```
EditorState → Nodes → exportDOM()/decorate() → DOM Elements/React Components → Browser Render
```

#### 3️⃣ 업데이트 사이클
```
사용자 입력 → editor.update() → 노드 수정 → EditorState 커밋 → OnChangePlugin 트리거
```

#### 4️⃣ HTML 추출 (Lexical → HTML)
```
EditorState → $generateHtmlFromNodes() → 각 노드의 exportDOM() → HTML String
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 개발 서버 실행

```bash
yarn dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 빌드

```bash
yarn build
```

## 📚 주요 기능

### ✅ HTML Import/Export
- 초기 HTML 콘텐츠 로딩
- 실시간 HTML 출력
- 양방향 변환 지원

### ✅ 커스텤 이미지 노드
- DecoratorNode를 상속한 ImageNode
- React 컴포넌트로 렌더링
- importDOM/exportDOM 구현

### ✅ Rich Text 편집
- 헤딩, 리스트, 인용문
- Bold, Italic, Underline
- Undo/Redo 기능

### ✅ 이미지 삽입
- 툴바 버튼을 통한 이미지 추가
- Command 패턴 사용

## 🔧 커스터마이징

### 새로운 노드 추가

1. `src/nodes/` 디렉토리에 노드 클래스 생성
2. `Editor.jsx`의 `nodes` 배열에 등록

```javascript
import { YourCustomNode } from './nodes/YourCustomNode';

const initialConfig = {
  nodes: [
    // ... 기존 노드들
    YourCustomNode,
  ],
};
```

### 새로운 플러그인 추가

1. `src/plugins/` 디렉토리에 플러그인 생성
2. `Editor.jsx`에서 플러그인 사용

```javascript
import { YourPlugin } from './plugins/YourPlugin';

<LexicalComposer initialConfig={initialConfig}>
  <YourPlugin />
  {/* ... 기존 플러그인들 */}
</LexicalComposer>
```

## 📖 주요 개념

### DecoratorNode
- React 컴포넌트를 렌더링하는 노드
- `decorate()` 메서드로 컴포넌트 반환
- ImageNode가 대표적인 예시

### Plugin 시스템
- React 컴포넌트 형태
- `useLexicalComposerContext`로 editor 접근
- 명령어 등록, 리스너 관리 등

### Command 패턴
- `createCommand()`로 명령어 생성
- `editor.registerCommand()`로 핸들러 등록
- `editor.dispatchCommand()`로 실행

## 🛠️ 기술 스택

- React 18
- Lexical 0.37
- Vite 5
- Tailwind CSS v4
- DaisyUI 4.4

## 📝 참고 자료

- [Lexical 공식 문서](https://lexical.dev/)
- [Lexical GitHub](https://github.com/facebook/lexical)
- [React 공식 문서](https://react.dev/)

## 📄 라이선스

MIT
