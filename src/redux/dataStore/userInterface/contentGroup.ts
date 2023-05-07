export interface ContentGroup {
  contentList: string[];
  selected: string | undefined;
}

export function addContentToGroup({ group, contentId }: { contentId: string; group: ContentGroup }) {
  group.contentList.push(contentId);
  group.selected = contentId;
}

export function removeContentFromGroup({ group, contentId }: { contentId: string; group: ContentGroup }) {
  const index = group.contentList.indexOf(contentId, 0);
  if (index === -1) {
    throw new Error(`Content id "${contentId}" currently not a tab, removing content failed.`);
  }
  // remove content from tab
  group.contentList.splice(index, 1);

  if (group.selected !== contentId) {
    return;
  }
  // the content was the currently selected tab, we try to select the neighboring content
  if (group.contentList.length === 0) {
    // no more tabs -> cannot select any content until new content is added
    group.selected = undefined;
  } else if (group.contentList.length > index) {
    // select content that is now in the same position as the removed content
    group.selected = group.contentList[index];
  } else {
    // removed content was last in list -> again select content in last position
    group.selected = group.contentList[index - 1];
  }
}
