import { useState, useCallback } from 'react';
import { Editor } from './Editor';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';

/**
 * App Component
 *
 * 역할: 에디터 사용 예시 및 데모
 */
function App() {
  // 초기 HTML 데이터
  const initialHtml = `
    <h1>Lexical 에디터 예제</h1>
    <p>이것은 <strong>Lexical</strong> 에디터의 예시입니다.</p>
    <p>HTML을 불러오고, 편집하고, 다시 HTML로 내보낼 수 있습니다.</p>
    <img src="https://picsum.photos/400/300" alt="샘플 이미지" />
    <h2>주요 기능</h2>
    <ul>
      <li>HTML Import/Export</li>
      <li>커스텀 이미지 노드</li>
      <li>Rich Text 편집</li>
      <li>Undo/Redo 기능</li>
    </ul>
  `;

  const [outputHtml, setOutputHtml] = useState('');

  // HTML 변경 콜백
  const handleChange = useCallback((html) => {
    setOutputHtml(html);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Header */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Lexical Editor Example</a>
        </div>
        <div className="flex-none">
          <a
            href="https://github.com/bini59/lexical"
            className="btn btn-ghost btn-sm gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 에디터 영역 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">에디터</h2>
              <Editor initialHtml={initialHtml} onChange={handleChange}>
                <ToolbarPlugin />
              </Editor>
            </div>
          </div>

          {/* HTML 출력 영역 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">출력 HTML</h2>
              <div className="mockup-code bg-neutral text-neutral-content max-h-[600px] overflow-auto">
                <pre className="px-4">{outputHtml}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p className="text-sm">
            아키텍처: User → LexicalComposer → Plugins → Lexical Core → Nodes → Browser DOM
          </p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
