/**
 * HTML을 보기 좋게 포맷팅하는 함수
 */
export function formatHtml(html:string) {
  const tab = '  ';
  let formatted = '';
  let indent = 0;

  // HTML을 태그 단위로 분리
  const tokens = html.split(/(<\/?[^>]+>)/g).filter(token => token.trim());

  tokens.forEach(token => {
    // 닫는 태그
    if (token.startsWith('</')) {
      indent--;
      formatted += tab.repeat(Math.max(0, indent)) + token + '\n';
    }
    // 자체 닫힘 태그 (img, br 등)
    else if (token.startsWith('<') && (token.endsWith('/>') || token.match(/<(img|br|hr|input)[^>]*>/))) {
      formatted += tab.repeat(indent) + token + '\n';
    }
    // 여는 태그
    else if (token.startsWith('<')) {
      formatted += tab.repeat(indent) + token + '\n';
      indent++;
    }
    // 텍스트 노드
    else {
      const trimmed = token.trim();
      if (trimmed) {
        formatted += tab.repeat(indent) + trimmed + '\n';
      }
    }
  });

  return formatted.trim();
}
