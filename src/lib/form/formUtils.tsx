import {
  Children,
  cloneElement,
  ComponentProps,
  ComponentType,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

export interface GridPositioning {
  label: { row: [number, number]; col: [number, number] };
  control: { row: [number, number]; col: [number, number] };
}

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
  header?: string;
}>;

type GridItemProps = PropsWithChildren<{
  gridPositioning?: GridPositioning;
  colSpan?: number;
  rowSpan?: number;
}>;

export const GridItem: ComponentType<PropsWithChildren<GridItemProps>> = ({
  children,
  gridPositioning,
}) =>
  Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child, { ...(child?.props ?? {}), gridPositioning } as any)
      : child
  );

export const GridGroup: ComponentType<PropsWithChildren<GridGroupProps>> = ({
  children,
}) => children;

const isGridGroup = (
  element: ReactNode
): element is ReactElement<GridGroupProps, typeof GridGroup> => {
  return isValidElement(element) && element.type === GridGroup;
};

const isGridItem = (
  element: ReactNode
): element is ReactElement<GridItemProps, typeof GridItem> => {
  return isValidElement(element) && element.type === GridItem;
};

interface Cursor {
  row: number;
  col: number;
}

interface BuiltChild {
  content: ReactNode;
  /** Первая свободная позиция справа и снизу от построенного узла. */
  nextCursor: Cursor;
}

const buildChild = (
  child: ReactNode,
  cursor: Cursor,
  groupDepth = 1,
  rightEdge?: number
): BuiltChild => {
  if (isGridItem(child)) {
    const gridItem = child;

    return {
      content: cloneElement(gridItem, {
        ...gridItem.props,
        gridPositioning: {
          label: {
            row: [cursor.row, cursor.row + 1 + (gridItem.props.rowSpan ?? 0)],
            col: [cursor.col, cursor.col + 1],
          },
          control: {
            row: [cursor.row, cursor.row + 1 + (gridItem.props.rowSpan ?? 0)],
            col: [
              cursor.col + 1,
              rightEdge ?? cursor.col + 2 + (gridItem.props.colSpan ?? 0),
            ],
          },
        },
      }),
      nextCursor: {
        row: cursor.row + 1 + (gridItem.props.rowSpan ?? 0),
        col: rightEdge ?? cursor.col + 2 + (gridItem.props.colSpan ?? 0),
      },
    };
  }

  if (isGridGroup(child)) {
    const group = child;

    const contentStart = {
      row: cursor.row + (group.props.header ? 1 : 0),
      col: cursor.col,
    };

    let childCursor = { ...cursor };
    // Always the right lowest point
    let bounds = { ...cursor };

    if (group.props.header) childCursor.row += 1;

    const contentRow: ReactNode[] = [];

    const groupChildren = Children.toArray(group.props.children);

    groupChildren.forEach((child, index) => {
      const { content, nextCursor } = buildChild(
        child,
        childCursor,
        groupDepth + 1,
        group.props.split && index < groupChildren.length - 1 ? undefined : rightEdge
      );

      bounds = {
        row: Math.max(bounds.row, nextCursor.row),
        col: Math.max(bounds.col, nextCursor.col),
      };

      childCursor = group.props.split
        ? { row: contentStart.row, col: nextCursor.col }
        : { row: nextCursor.row, col: contentStart.col };

      contentRow.push(content);
    });

    if (group.props.header)
      contentRow.unshift(
        <div
          className={`lsdvrform-form__group-header lsdvrform-form__group-header__${groupDepth}`}
          style={{
            alignSelf: "center",
            gridColumn: `${cursor.col} / ${bounds.col}`,
            gridRow: `${cursor.row} / ${cursor.row + 1}`,
          }}
        >
          {group.props.header}
        </div>
      );

    return {
      content: contentRow,
      nextCursor: bounds,
    };
  }

  return { content: null, nextCursor: cursor };
};

export const buildGrid = (children: ReactNode): ReactNode => {
  const rightEdge = Math.max(
    1,
    ...Children.toArray(children).map(
      (child) => buildChild(child, { col: 1, row: 1 }).nextCursor.col
    )
  );
  let cursor = { col: 1, row: 1 };

  return Children.map(children, (child) => {
    const result = buildChild(child, cursor, 1, rightEdge);

    cursor = { col: cursor.col, row: result.nextCursor.row };

    return result.content;
  });
};
