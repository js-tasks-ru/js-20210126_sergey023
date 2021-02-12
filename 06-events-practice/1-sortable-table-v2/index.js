import SortableTableDefault from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableDefault{
    constructor(header, data) {
        super(header, data);

        this.addEvents();
    }

    addEvents() {
        Array.from(this.subElements.header.children).map(column => {
            if(column.dataset.sortable !== 'false') {
                column.addEventListener('pointerdown',(event) => {this.updateColumn(column, event.currentTarget)});
            }
        });

        const {children} = this.subElements.header;
        const [title] = children;

        title.dispatchEvent(new MouseEvent('pointerdown'));
    }
}
