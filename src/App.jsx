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
          <a></a>
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
