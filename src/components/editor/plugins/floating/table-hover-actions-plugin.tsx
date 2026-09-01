import { useCallback, useEffect, useRef, useState } from "react"

import { createPortal } from "react-dom"

import {
  $getNearestNodeFromDOMNode,
  type EditorThemeClasses,
  getComposedEventTarget,
  isHTMLElement,
  isHTMLTableRowElement,
  mergeRegister,
  registerEventListener,
} from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"
import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
} from "@lexical/table"

import { Plus, Trash2 } from "lucide-react"

import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { cn } from "@/lib/utils"

type ActionsPosition = { x: number; y: number; canDelete: boolean }

const BUTTON_CLASSNAME =
  "flex size-5 cursor-pointer items-center justify-center rounded-sm border bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"

function getCellSelector(theme: EditorThemeClasses | null | undefined): string {
  const cellClassName = theme?.tableCell?.split(/\s+/)[0]
  return cellClassName ? `td.${cellClassName}, th.${cellClassName}` : "td, th"
}

function getColumnCount(tableElement: HTMLTableElement): number {
  const firstRow = tableElement.rows[0]
  if (!firstRow) {
    return 0
  }
  return Array.from(firstRow.cells).reduce(
    (count, cell) => count + cell.colSpan,
    0
  )
}

function getClosestTopCell(
  tableElement: HTMLTableElement,
  clientX: number
): HTMLTableCellElement | null {
  const firstRow = tableElement.rows[0]
  if (!firstRow) {
    return null
  }

  let closest: HTMLTableCellElement | null = null
  let smallestDelta = Number.POSITIVE_INFINITY

  for (const cell of Array.from(firstRow.cells)) {
    const rect = cell.getBoundingClientRect()
    const delta = Math.abs(rect.left + rect.width / 2 - clientX)
    if (delta < smallestDelta) {
      smallestDelta = delta
      closest = cell
    }
  }

  return closest
}

export function TableHoverActionsPlugin() {
  const [editor, { getTheme }] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const { t } = useTranslation()
  const [columnPosition, setColumnPosition] = useState<ActionsPosition | null>(
    null
  )
  const [rowPosition, setRowPosition] = useState<ActionsPosition | null>(null)
  const columnActionsRef = useRef<HTMLDivElement | null>(null)
  const rowActionsRef = useRef<HTMLDivElement | null>(null)
  const columnCellRef = useRef<HTMLTableCellElement | null>(null)
  const rowCellRef = useRef<HTMLTableCellElement | null>(null)

  const hideActions = useCallback(() => {
    columnCellRef.current = null
    rowCellRef.current = null
    setColumnPosition(null)
    setRowPosition(null)
  }, [])

  const updatePositions = useCallback(() => {
    const columnCell = columnCellRef.current
    const columnTable = columnCell?.closest("table") ?? null
    if (columnCell?.isConnected && columnTable) {
      const rect = columnCell.getBoundingClientRect()
      setColumnPosition({
        x: rect.left + rect.width / 2,
        y: columnTable.getBoundingClientRect().top,
        canDelete: getColumnCount(columnTable) > 1,
      })
    } else {
      columnCellRef.current = null
      setColumnPosition(null)
    }

    const rowCell = rowCellRef.current
    const rowTable = rowCell?.closest("table") ?? null
    if (rowCell?.isConnected && rowTable) {
      const rect = rowCell.getBoundingClientRect()
      const tableRect = rowTable.getBoundingClientRect()
      const isRTL = getComputedStyle(rowTable).direction === "rtl"
      setRowPosition({
        x: isRTL ? tableRect.right : tableRect.left,
        y: rect.top + rect.height / 2,
        canDelete: rowTable.rows.length > 1,
      })
    } else {
      rowCellRef.current = null
      setRowPosition(null)
    }
  }, [])

  useEffect(() => {
    if (!isEditable) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const target = getComposedEventTarget(event)
      if (!isHTMLElement(target)) {
        return
      }
      if (
        columnActionsRef.current?.contains(target) ||
        rowActionsRef.current?.contains(target)
      ) {
        return
      }

      const cell = target.closest<HTMLTableCellElement>(
        getCellSelector(getTheme())
      )
      const tableElement = cell?.closest("table") ?? null
      const rootElement = editor.getRootElement()

      if (
        !cell ||
        tableElement === null ||
        rootElement === null ||
        !rootElement.contains(tableElement)
      ) {
        hideActions()
        return
      }

      const rowIndex = isHTMLTableRowElement(cell.parentElement)
        ? cell.parentElement.rowIndex
        : -1
      columnCellRef.current =
        rowIndex === 0 ? getClosestTopCell(tableElement, event.clientX) : null
      rowCellRef.current = cell.cellIndex === 0 ? cell : null
      updatePositions()
    }

    return mergeRegister(
      registerEventListener(document, "mousemove", handleMouseMove),
      hideActions
    )
  }, [editor, getTheme, hideActions, isEditable, updatePositions])

  useEffect(() => {
    if (!isEditable) {
      return
    }

    const handleMouseLeave = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget
      if (
        nextTarget instanceof Node &&
        (columnActionsRef.current?.contains(nextTarget) ||
          rowActionsRef.current?.contains(nextTarget))
      ) {
        return
      }
      hideActions()
    }

    return editor.registerRootListener((rootElement) => {
      if (rootElement) {
        return registerEventListener(
          rootElement,
          "mouseleave",
          handleMouseLeave
        )
      }
    })
  }, [editor, hideActions, isEditable])

  useEffect(() => {
    return mergeRegister(
      registerEventListener(window, "resize", updatePositions),
      registerEventListener(document, "scroll", updatePositions, true),
      editor.registerUpdateListener(updatePositions)
    )
  }, [editor, updatePositions])

  const withCell = (
    cellRef: React.RefObject<HTMLTableCellElement | null>,
    $action: () => void
  ) => {
    const cell = cellRef.current
    if (!cell) {
      return
    }
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(cell)
      if ($isTableCellNode(node)) {
        node.selectEnd()
        $action()
      }
    })
  }

  if (!isEditable) {
    return null
  }

  return createPortal(
    <>
      {columnPosition ? (
        <div
          ref={columnActionsRef}
          className="fixed z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-0.5"
          style={{ left: columnPosition.x, top: columnPosition.y }}
        >
          <button
            type="button"
            aria-label={t.addTableColumn}
            title={t.addTableColumn}
            className={BUTTON_CLASSNAME}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              withCell(columnCellRef, $insertTableColumnAtSelection)
            }
          >
            <Plus className="size-3.5" />
          </button>
          {columnPosition.canDelete ? (
            <button
              type="button"
              aria-label={t.deleteTableColumn}
              title={t.deleteTableColumn}
              className={cn(BUTTON_CLASSNAME, "hover:text-destructive")}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                withCell(columnCellRef, $deleteTableColumnAtSelection)
              }
            >
              <Trash2 className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}
      {rowPosition ? (
        <div
          ref={rowActionsRef}
          className="fixed z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
          style={{ left: rowPosition.x, top: rowPosition.y }}
        >
          <button
            type="button"
            aria-label={t.addTableRow}
            title={t.addTableRow}
            className={BUTTON_CLASSNAME}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => withCell(rowCellRef, $insertTableRowAtSelection)}
          >
            <Plus className="size-3.5" />
          </button>
          {rowPosition.canDelete ? (
            <button
              type="button"
              aria-label={t.deleteTableRow}
              title={t.deleteTableRow}
              className={cn(BUTTON_CLASSNAME, "hover:text-destructive")}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => withCell(rowCellRef, $deleteTableRowAtSelection)}
            >
              <Trash2 className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>,
    document.body
  )
}
