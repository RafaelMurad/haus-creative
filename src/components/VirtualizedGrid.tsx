import { memo, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { MediaItem as MediaItemType } from '../types';
import { lazy, Suspense } from 'react';

const MediaItem = lazy(() => import('./MediaItem'));

interface VirtualizedGridProps {
  items: MediaItemType[];
}

const GridCell = memo(({ columnIndex, rowIndex, style, data }: any) => {
  const { items, columnCount } = data;
  const index = rowIndex * columnCount + columnIndex;
  
  if (index >= items.length) return null;
  
  const item = items[index];
  
  return (
    <div style={style} className="p-1 md:p-2">
      <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse rounded" />}>
        <MediaItem 
          item={item} 
          priority={index < 12} // Prioritize first 12 items
          className="w-full h-full rounded overflow-hidden"
        />
      </Suspense>
    </div>
  );
});

GridCell.displayName = 'GridCell';

export default memo(function VirtualizedGrid({ items }: VirtualizedGridProps) {
  const { columnCount, cellWidth, cellHeight, gridWidth, gridHeight } = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    let cols = 3;
    if (isMobile) cols = 1;
    else if (isTablet) cols = 2;
    
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    const cellW = Math.floor(width / cols);
    const cellH = isMobile ? 300 : 250;
    const gridW = Math.min(cols * cellW, width);
    const gridH = Math.min(600, height * 0.8);
    
    return {
      columnCount: cols,
      cellWidth: cellW,
      cellHeight: cellH,
      gridWidth: gridW,
      gridHeight: gridH
    };
  }, []);

  const rowCount = Math.ceil(items.length / columnCount);

  return (
    <div className="virtualized-grid w-full flex justify-center">
      <Grid
        columnCount={columnCount}
        rowCount={rowCount}
        columnWidth={cellWidth}
        rowHeight={cellHeight}
        width={gridWidth}
        height={gridHeight}
        itemData={{ items, columnCount }}
        overscanRowCount={2}
        overscanColumnCount={1}
      >
        {GridCell}
      </Grid>
    </div>
  );
});