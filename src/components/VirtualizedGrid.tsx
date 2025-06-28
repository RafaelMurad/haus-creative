import { memo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { MediaItem as MediaItemType } from '../types';
import MediaItem from './MediaItem';

interface VirtualizedGridProps {
  items: MediaItemType[];
}

const GridCell = memo(({ columnIndex, rowIndex, style, data }: any) => {
  const { items, columnCount } = data;
  const index = rowIndex * columnCount + columnIndex;
  
  if (index >= items.length) return null;
  
  const item = items[index];
  
  return (
    <div style={style} className="p-2">
      <MediaItem 
        item={item} 
        priority={index < 12} // Prioritize first 12 items
        className="w-full h-full"
      />
    </div>
  );
});

GridCell.displayName = 'GridCell';

export default memo(function VirtualizedGrid({ items }: VirtualizedGridProps) {
  const columnCount = 3;
  const rowCount = Math.ceil(items.length / columnCount);
  const cellWidth = 300;
  const cellHeight = 300;
  const width = Math.min(columnCount * cellWidth, window.innerWidth);
  const height = Math.min(600, window.innerHeight * 0.8);

  return (
    <Grid
      columnCount={columnCount}
      rowCount={rowCount}
      columnWidth={cellWidth}
      rowHeight={cellHeight}
      width={width}
      height={height}
      itemData={{ items, columnCount }}
    >
      {GridCell}
    </Grid>
  );
});