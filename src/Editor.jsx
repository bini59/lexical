import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

import { ImageNode } from './nodes/ImageNode';
import { LoadHTMLPlugin } from './plugins/LoadHTMLPlugin';
import { OnChangePlugin } from './plugins/OnChangePlugin';
import { ImagePlugin } from './plugins/ImagePlugin';

/**
 * Editor Component
 *
 * 역할: LexicalComposer를 중심으로 모든 플러그인과 노드 통합
 *
 * Props:
 * - initialHtml: 초기 HTML 콘텐츠
 * - onChange: HTML 변경 콜백
 * - children: 추가 플러그인 (예: ToolbarPlugin)
 */
export function Editor({ initialHtml, onChange, children }) {
  // 에디터 초기 설정
  const initialConfig = {
    namespace: 'LexicalEditor',
    editable: true, // 에디터를 편집 가능하게 설정

    // 사용 가능한 노드 타입 등록
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      ImageNode, // 커스텀 이미지 노드
    ],

    // 테마: CSS 클래스 매핑
    theme: {
      paragraph: 'editor-paragraph',
      quote: 'editor-quote',
      heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
      },
      list: {
        ul: 'editor-list-ul',
        ol: 'editor-list-ol',
        listitem: 'editor-listitem',
      },
      text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
      },
    },

    // 전역 에러 핸들러
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        {/* 추가 플러그인 (Toolbar 등) */}
        {children}

        {/* 기본 텍스트 편집 기능 */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input" />
          }
          placeholder={
            <div className="editor-placeholder">
              텍스트를 입력하세요...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* Undo/Redo 기능 */}
        <HistoryPlugin />

        {/* 리스트 기능 */}
        <ListPlugin />

        {/* HTML → Lexical 변환 */}
        <LoadHTMLPlugin initialHtml={initialHtml} />

        {/* Lexical → HTML 변환 및 onChange 콜백 */}
        <OnChangePlugin onChange={onChange} />

        {/* 이미지 삽입 명령어 등록 */}
        <ImagePlugin />
      </div>
    </LexicalComposer>
  );
}
