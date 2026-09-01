import { getDOMSelectionRangeAndPoints } from "lexical"

export function getDOMRangeRect(
  nativeSelection: Selection,
  rootElement: HTMLElement
): DOMRect {
  const { points, range } = getDOMSelectionRangeAndPoints(
    nativeSelection,
    rootElement
  )
  if (points.anchorNode === rootElement || range === null) {
    let inner = rootElement
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild as HTMLElement
    }
    return inner.getBoundingClientRect()
  }
  return range.getBoundingClientRect()
}

export function setFloatingAnchorRect(
  floatingAnchor: HTMLElement,
  targetRect: DOMRect
): void {
  floatingAnchor.style.transform = `translate(${targetRect.left}px, ${targetRect.top}px)`
  floatingAnchor.style.width = `${targetRect.width}px`
  floatingAnchor.style.height = `${targetRect.height}px`
}

export function hideFloatingAnchor(floatingAnchor: HTMLElement): void {
  floatingAnchor.style.transform = "translate(-10000px, -10000px)"
}
