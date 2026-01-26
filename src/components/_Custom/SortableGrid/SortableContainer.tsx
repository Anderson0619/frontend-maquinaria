import {
  SortableContainer as SC,
  SortableContainerProps,
  SortableElement as SE,
  SortableElementProps,
  SortableHandle as SH,
} from "react-sortable-hoc";
import Icon from "../Icon/Icon";
import {
  DeleteItemContainer,
  Element,
  Handle,
  SortableContainerContainer,
} from "./SortableGrid.style";
import { IRenderItem, ISortableItem } from "./types";

interface ISortableContainer extends SortableContainerProps {
  renderItem?: (params: IRenderItem) => JSX.Element;
  shouldUseDragHandle: boolean;
  deletable: boolean;
  items: ISortableItem[];
  onChange?: (sortedItems: ISortableItem[]) => void;
}

interface ISortableElement extends SortableElementProps, ISortableContainer {
  item: ISortableItem;
  currentIndex: number;
}

const SortableHandle = SH(({ tabIndex }) => <Handle tabIndex={tabIndex} />);

const SortableElement = SE((props: ISortableElement) => {
  const {
    item,
    renderItem,
    shouldUseDragHandle,
    deletable,
    items,
    onChange,
    currentIndex,
  } = props;

  const deleteItem = () => {
    const newItems = items.filter((i) => i.sortId !== item.sortId);

    if (onChange) {
      onChange(newItems);
    }
  };

  return (
    <Element>
      {shouldUseDragHandle && <SortableHandle tabIndex={currentIndex} />}
      {deletable && (
        <DeleteItemContainer onClick={deleteItem}>
          <Icon icon="trash" />
        </DeleteItemContainer>
      )}
      {renderItem ? renderItem({ item: item.item, currentIndex }) : item.item}
    </Element>
  );
});

const SortableContainer = SC((props: ISortableContainer) => {
  const { items, ...restProps } = props;
  return (
    <SortableContainerContainer>
      {items.map((item, index) => (
        <SortableElement
          key={`item-${item.sortId}`}
          index={index}
          currentIndex={index}
          item={item}
          items={items}
          {...restProps}
        />
      ))}
    </SortableContainerContainer>
  );
});

export default SortableContainer;
