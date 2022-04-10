/* We could later extend this to support percentages as well,
 * but just for now we go with pixels only
 */
export type FixedColumnMeasurement = 'px';

export interface FixedTableColumn {
  name: string;
  width: number;
  measurement: FixedColumnMeasurement;
}

export class FixedTableColumnsConfig {

  private columnWidthsMap = new Map<string, { width: number, measurement: FixedColumnMeasurement }>();

  constructor(columns: FixedTableColumn[]) {
    if (columns && columns.length && Array.isArray(columns)) {
      columns.forEach(({ name, width, measurement }: FixedTableColumn) => {
        this.columnWidthsMap.set(name, { width, measurement });
      });
    }
  }

  getColumnWidth(columnName: string): string {
    const column = this.columnWidthsMap.get(columnName);

    return column.width + column.measurement;
  }

  getTotalColumnsWidth(): number {
    let totalWidth = 0;

    this.columnWidthsMap.forEach(({width}) => {
      totalWidth += width;
    });

    return totalWidth;
  }
}
