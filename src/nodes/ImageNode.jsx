import { DecoratorNode } from 'lexical';

/**
 * ImageComponent: ImageNode가 렌더링하는 React 컴포넌트
 */
function ImageComponent({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: '10px 0',
      }}
    />
  );
}

/**
 * ImageNode: 이미지를 표현하는 커스텀 DecoratorNode
 */
export class ImageNode extends DecoratorNode {
  __src;
  __alt;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src, alt, key) {
    super(key);
    this.__src = src;
    this.__alt = alt || '';
  }

  /**
   * DOM → ImageNode 변환 규칙 정의
   */
  static importDOM() {
    return {
      img: (domNode) => {
        if (domNode.nodeName === 'IMG') {
          return {
            conversion: (element) => {
              const src = element.getAttribute('src');
              const alt = element.getAttribute('alt') || '';
              return {
                node: new ImageNode(src, alt),
              };
            },
            priority: 0,
          };
        }
        return null;
      },
    };
  }

  /**
   * JSON → ImageNode 역직렬화
   */
  static importJSON(serializedNode) {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }

  /**
   * DOM 요소 생성 (DecoratorNode 필수 메서드)
   */
  createDOM() {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  /**
   * DOM 업데이트 (DecoratorNode 필수 메서드)
   */
  updateDOM() {
    return false;
  }

  /**
   * ImageNode → DOM 변환
   */
  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__alt);
    return { element };
  }

  /**
   * ImageNode → JSON 직렬화
   */
  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt,
    };
  }

  /**
   * React 컴포넌트 반환 (DecoratorNode의 핵심 메서드)
   */
  decorate() {
    return <ImageComponent src={this.__src} alt={this.__alt} />;
  }

  /**
   * 수정 가능한 노드 복사본 반환을 위한 헬퍼
   */
  getSrc() {
    const self = this.getLatest();
    return self.__src;
  }

  getAlt() {
    const self = this.getLatest();
    return self.__alt;
  }
}

/**
 * ImageNode 생성 헬퍼 함수
 */
export function $createImageNode(src, alt) {
  return new ImageNode(src, alt);
}

/**
 * ImageNode 타입 체크 함수
 */
export function $isImageNode(node) {
  return node instanceof ImageNode;
}
