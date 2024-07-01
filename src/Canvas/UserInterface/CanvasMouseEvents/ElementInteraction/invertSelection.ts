export function invertSelection({
  selectedElements,
  elementToInvert,
}: {
  selectedElements: string[];
  elementToInvert: string;
}): string[] {
  if (selectedElements.includes(elementToInvert)) {
    return selectedElements.filter((element) => element !== elementToInvert);
  } else {
    return [...selectedElements, elementToInvert];
  }
}
