import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { $insertNodes } from 'lexical';
import { $createImageNode } from '../nodes/ImageNode';

/**
 * INSERT_IMAGE_COMMAND: 이미지 삽입 명령어
 * 외부에서 editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, alt })로 사용
 */
export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

/**
 * ImagePlugin
 *
 * 역할: 이미지 삽입 명령어 등록 및 처리
 *
 * 흐름:
 * 1. INSERT_IMAGE_COMMAND 리스너 등록
 * 2. 명령어 수신 시 ImageNode 생성
 * 3. editor.update()로 노드 삽입
 */
export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 이미지 삽입 명령어 리스너 등록
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const { src, alt } = payload;

        // 쓰기 모드로 노드 삽입
        editor.update(() => {
          const imageNode = $createImageNode(src, alt);
          $insertNodes([imageNode]);
        });

        return true; // 명령어 처리 완료
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
