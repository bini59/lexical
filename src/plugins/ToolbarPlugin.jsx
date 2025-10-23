import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $createParagraphNode } from 'lexical';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';

/**
 * ToolbarPlugin
 *
 * 일반적인 텍스트 에디터 툴바 기능 제공:
 * - 텍스트 포맷팅 (Bold, Italic, Underline, Strikethrough)
 * - 블록 타입 (Paragraph, H1, H2, H3, Quote)
 * - 리스트 (Bullet, Numbered)
 * - Undo/Redo
 * - 이미지 삽입
 */
export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  // 툴바 상태
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  // 에디터 상태 업데이트
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      // 텍스트 포맷 상태
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // 블록 타입 감지
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  // 포맷 토글
  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  // 블록 타입 변경
  const formatHeading = (headingTag) => {
    if (blockType !== headingTag) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingTag));
        }
      });
    }
  };

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  // 리스트 토글
  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  // Undo/Redo
  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  // 이미지 삽입
  const insertImage = () => {
    const src = prompt('이미지 URL을 입력하세요:');
    if (src) {
      const alt = prompt('이미지 설명을 입력하세요 (선택):') || '';
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, alt });
    }
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap gap-1 p-3 bg-base-200 border-base-300 rounded-t-lg">
      {/* Undo/Redo */}
      <div className="flex gap-1 pr-2 border-r border-base-300">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="btn btn-sm btn-ghost"
          title="실행 취소 (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="btn btn-sm btn-ghost"
          title="다시 실행 (Ctrl+Y)"
        >
          ↷
        </button>
      </div>

      {/* 블록 타입 */}
      <div className="flex gap-1 pr-2 border-r border-base-300">
        <button
          onClick={formatParagraph}
          className={`btn btn-sm ${blockType === 'paragraph' ? 'btn-primary' : 'btn-ghost'}`}
          title="단락"
        >
          P
        </button>
        <button
          onClick={() => formatHeading('h1')}
          className={`btn btn-sm ${blockType === 'h1' ? 'btn-primary' : 'btn-ghost'}`}
          title="제목 1"
        >
          H1
        </button>
        <button
          onClick={() => formatHeading('h2')}
          className={`btn btn-sm ${blockType === 'h2' ? 'btn-primary' : 'btn-ghost'}`}
          title="제목 2"
        >
          H2
        </button>
        <button
          onClick={() => formatHeading('h3')}
          className={`btn btn-sm ${blockType === 'h3' ? 'btn-primary' : 'btn-ghost'}`}
          title="제목 3"
        >
          H3
        </button>
        <button
          onClick={formatQuote}
          className={`btn btn-sm ${blockType === 'quote' ? 'btn-primary' : 'btn-ghost'}`}
          title="인용구"
        >
          "
        </button>
      </div>

      {/* 텍스트 포맷 */}
      <div className="flex gap-1 pr-2 border-r border-base-300">
        <button
          onClick={() => formatText('bold')}
          className={`btn btn-sm ${isBold ? 'btn-primary' : 'btn-ghost'}`}
          title="굵게 (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => formatText('italic')}
          className={`btn btn-sm ${isItalic ? 'btn-primary' : 'btn-ghost'}`}
          title="기울임 (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => formatText('underline')}
          className={`btn btn-sm ${isUnderline ? 'btn-primary' : 'btn-ghost'}`}
          title="밑줄 (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => formatText('strikethrough')}
          className={`btn btn-sm ${isStrikethrough ? 'btn-primary' : 'btn-ghost'}`}
          title="취소선"
        >
          <s>S</s>
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex gap-1 pr-2 border-r border-base-300">
        <button
          onClick={formatBulletList}
          className={`btn btn-sm ${blockType === 'bullet' ? 'btn-primary' : 'btn-ghost'}`}
          title="글머리 기호"
        >
          • List
        </button>
        <button
          onClick={formatNumberedList}
          className={`btn btn-sm ${blockType === 'number' ? 'btn-primary' : 'btn-ghost'}`}
          title="번호 매기기"
        >
          1. List
        </button>
      </div>

      {/* 이미지 */}
      <div className="flex gap-1">
        <button
          onClick={insertImage}
          className="btn btn-sm btn-ghost"
          title="이미지 삽입"
        >
          🖼️ 이미지
        </button>
      </div>
    </div>
  );
}
