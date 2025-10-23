import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';

import { formatHtml } from '../utils/format';

/**
 * OnChangePlugin
 *
 * 역할: 에디터 상태 변경을 감지하고 HTML로 변환하여 외부로 전달
 *
 * 흐름:
 * 1. editor.registerUpdateListener()로 변경 감지
 * 2. editorState.read()로 현재 상태 읽기
 * 3. $generateHtmlFromNodes()로 HTML 생성
 *    → 각 노드의 exportDOM() 메서드 호출
 * 4. onChange 콜백으로 HTML 전달
 */
export function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onChange) return;

    // 에디터 상태 변경 리스너 등록
    return editor.registerUpdateListener(({ editorState }) => {
      // 읽기 모드로 상태 접근
      editorState.read(() => {
        // Lexical Nodes → HTML 변환
        // ImageNode.exportDOM()이 이 시점에 호출됨
        const htmlString = $generateHtmlFromNodes(editor);

        // HTML 포맷팅
        const formattedHtml = formatHtml(htmlString);

        // 외부로 HTML 전달
        onChange(formattedHtml);
      });
    });
  }, [editor, onChange]);

  return null;
}
