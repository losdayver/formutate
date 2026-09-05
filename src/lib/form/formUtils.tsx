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
import { PreparedFormItem, EmptyFormItem } from "../formItem/formItem";

type GridGroupProps = PropsWithChildren<{
  split?: boolean;
  header?: string;
}>;

export const GridGroup: ComponentType<PropsWithChildren<GridGroupProps>> = ({
  children,
}) => children;

const isGridGroup = (
  element: ReactNode
): element is ReactElement<GridGroupProps, typeof GridGroup> => {
  return isValidElement(element) && element.type === GridGroup;
};

type GridItemElement = ReactElement<
  ComponentProps<typeof PreparedFormItem>,
  typeof PreparedFormItem
>;

const isGridItem = (element: ReactNode): element is GridItemElement => {
  return isValidElement(element) && element.type === PreparedFormItem;
};

type EmptyGridItemElement = ReactElement<
  ComponentProps<typeof EmptyFormItem>,
  typeof EmptyFormItem
>;

const isEmptyGridItem = (
  element: ReactNode
): element is EmptyGridItemElement => {
  return isValidElement(element) && element.type === EmptyFormItem;
};

type GridRowElement = GridItemElement | EmptyGridItemElement;

interface GridItemCell {
  type: "item";
  element: GridRowElement;
  column: number;
  row: number;
}

interface GridHeaderCell {
  type: "header";
  column: number;
  row: number;
  columnSpan: number;
  content: string;
}

type GridCell = GridItemCell | GridHeaderCell;

interface GridLayout {
  width: number;
  height: number;
  cells: GridCell[];
}

const offsetLayoutCells = (
  layout: GridLayout,
  columnOffset: number,
  rowOffset: number
): GridCell[] =>
  layout.cells.map((cell) => ({
    ...cell,
    column: cell.column + columnOffset,
    row: cell.row + rowOffset,
  }));

const stackLayoutsVertically = (layouts: GridLayout[]): GridLayout => {
  let rowOffset = 0;
  const cells: GridCell[] = [];

  for (const layout of layouts) {
    cells.push(...offsetLayoutCells(layout, 0, rowOffset));
    rowOffset += layout.height;
  }

  return {
    width: Math.max(0, ...layouts.map(({ width }) => width)),
    height: rowOffset,
    cells,
  };
};

const stackLayoutsHorizontally = (layouts: GridLayout[]): GridLayout => {
  const height = Math.max(0, ...layouts.map((layout) => layout.height));
  let columnOffset = 0;
  const cells: GridCell[] = [];

  for (const layout of layouts) {
    cells.push(
      ...offsetLayoutCells(layout, columnOffset, height - layout.height)
    );
    columnOffset += layout.width;
  }

  return {
    width: columnOffset,
    height,
    cells,
  };
};

const buildGridGroupLayout = (
  children: ReactNode,
  split: boolean,
  header?: string
): GridLayout => {
  const childLayouts: GridLayout[] = [];

  Children.forEach(children, (element) => {
    if (isGridGroup(element)) {
      childLayouts.push(
        buildGridGroupLayout(
          element.props.children,
          element.props.split === true,
          element.props.header
        )
      );
    } else if (isGridItem(element) || isEmptyGridItem(element)) {
      childLayouts.push({
        width: 2,
        height: 1,
        cells: [{ type: "item", element, column: 0, row: 0 }],
      });
    }
  });

  const contentLayout = split
    ? stackLayoutsHorizontally(childLayouts)
    : stackLayoutsVertically(childLayouts);
  const width = Math.max(2, contentLayout.width);

  if (header === undefined) {
    return { ...contentLayout, width };
  }

  return {
    width,
    height: contentLayout.height + 1,
    cells: [
      {
        type: "header",
        content: header,
        column: 0,
        row: 0,
        columnSpan: width,
      },
      ...offsetLayoutCells(contentLayout, 0, 1),
    ],
  };
};

export const buildGrid = (children: ReactNode): ReactNode => {
  const layout = buildGridGroupLayout(children, false);

  return layout.cells.map((cell, cellIndex) => {
    const rowStart = cell.row + 1;

    if (cell.type === "header") {
      return (
        <div
          className="lsdvrform-form__group-header"
          key={`grid-header-${cellIndex}`}
          style={{
            gridColumn: `${cell.column + 1} / span ${cell.columnSpan}`,
            gridRow: `${rowStart} / ${rowStart + 1}`,
          }}
        >
          {cell.content}
        </div>
      );
    }

    const { element } = cell;
    if (isEmptyGridItem(element)) return null;

    const labelColumnStart = cell.column + 1;
    const controlColumnStart = labelColumnStart + 1;

    return cloneElement(element, {
      ...element.props,
      key: element.key ?? `grid-item-${cellIndex}`,
      additionalProps: {
        ...element.props.additionalProps,
        gridPositioning: {
          label: {
            vertical: { from: rowStart, to: rowStart + 1 },
            horizontal: {
              from: labelColumnStart,
              to: labelColumnStart + 1,
            },
          },
          control: {
            vertical: { from: rowStart, to: rowStart + 1 },
            horizontal: {
              from: controlColumnStart,
              to: controlColumnStart + 1,
            },
          },
        },
      },
    });
  });
};
