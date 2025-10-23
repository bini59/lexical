import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';

/**
 * LoadHTMLPlugin
 *
 * 역할: 초기 HTML 데이터를 Lexical 노드 트리로 변환
 *
 * 흐름:
 * 1. HTML 문자열 → DOMParser로 DOM 변환
 * 2. DOM → $generateNodesFromDOM()으로 Lexical 노드 생성
 * 3. 노드들을 에디터 루트에 삽입
 */
export function LoadHTMLPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialHtml) return;

    editor.update(() => {
      // HTML 문자열 → DOM 변환
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');

      // DOM → Lexical Nodes 변환
      // ImageNode.importDOM()이 이 시점에 호출됨
      const nodes = $generateNodesFromDOM(editor, dom);

      // 기존 내용 제거 후 새 노드 삽입
      const root = $getRoot();
      root.clear();
      root.select();
      $insertNodes(nodes);
    });
  }, [editor, initialHtml]);

  return null;
}
