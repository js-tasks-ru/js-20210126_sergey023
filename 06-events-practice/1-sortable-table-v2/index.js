import SortableTableDefault from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableDefault{
    constructor(header, data) {
        super(header, data);

        this.addEvents();
    }

    addEvents() {
        let sortedColumn = '';

        Array.from(this.subElements.header.children).map(column => {
            if(column.dataset.sortable !== 'false') {
                column.addEventListener('pointerdown',(event) => {this.updateColumn(column, event.currentTarget)});

                if(!sortedColumn) {
                    sortedColumn = column;
                }
            }
        });

        sortedColumn.dispatchEvent(new MouseEvent('pointerdown'));
    }
}
