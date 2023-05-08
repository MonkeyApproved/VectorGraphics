import { AnyContent, AnyContentTypes, MainContentTypes, getNewContent } from './content';

export interface ContentDict {
  [id: string]: AnyContent;
}

export function addContentToDict({ dict, type, label }: { dict: ContentDict; type: MainContentTypes; label: string }) {
  const content = getNewContent({ containerId: 'tabs', type, label });
  dict[content.id] = content;
  return content;
}

export function getAllContentSameType({ type, dict }: { type: AnyContentTypes; dict: ContentDict }): AnyContent[] {
  return Object.values(dict).filter((content: AnyContent) => content.type === type);
}
