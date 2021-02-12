export default class SortableTable {
    subElements = {};

    constructor(header = [], {data} = []) {
        this.header = header;
        this.data = data;

        this.render();
    }

    sort(field = 'title', param = 'asc') {
        let method;

        switch (param) {
            case 'asc':
                method = 1;
                break;
            case 'desc':
                method = -1;
                break;
            default:
                return;
        }

        this.data = this.data.sort((str1, str2) => {
            if (isNaN(str1[field]) && isNaN(str2[field])) {
                return str1[field].localeCompare(str2[field], ['ru', 'en'], {caseFirst: 'upper'}) * method;
            } else {
                return (str1[field] - str2[field]) * method;
            }
        });

        this.subElements.body ? this.subElements.body.innerHTML = this.templateBody : '';
    }


    render() {
        const element = document.createElement('div');

        element.innerHTML = `<div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${this.templateHeader}
                </div>
                <div data-element="body" class="sortable-table__body">
                    ${this.templateBody}
                </div>
            </div>
        </div>`;

        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');

        return [...elements].reduce((obj, subElement) => {
          obj[subElement.dataset.element] = subElement;

          return obj;
        }, {});
    }

    get templateHeader() {
        return this.header.map(item => {
            return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
                <span>${item.title}</span>
            </div>`;
        }).join('');
    }

    get templateBody() {
        return this.data.map(item => {
            const image = item.images && `<div class="sortable-table__cell">
                <img class="sortable-table-image" alt="Image" src="${item.images}">
            </div>`;
            const quantity = item.quantity && `<div class="sortable-table__cell">${item.quantity}</div>`;
            const sales = item.sales && `<div class="sortable-table__cell">${item.sales}</div>`;

            return `<a href="/products/${item.id}" class="sortable-table__row">
                ${image || ''}
                <div class="sortable-table__cell">${item.title}</div>
                ${quantity || ''}
                <div class="sortable-table__cell">${item.price}</div>
                ${sales || ''}
             </a>`;
        }).join('');
    }

    remove() {
        this.element && this.element.remove();
    }

    destroy() {
        this.remove();
        this.element = null;
        this.subElement = {}
    }
}

