import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

// 1. get
export default class SortableTable {

    subElements = {};

    constructor(header = [], {data} = []) {
        this.header = header;
        this.data = data;

        this.render();
    }

    update(data) {
        this.data += data;
        this.subElements.body && this.subElements.body.insertAdjacentHTML('beforeend', this.templateBody(data));
        this.status = true;
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

        this.subElements.body ? this.subElements.body.innerHTML = this.templateBody() : '';
    }

    updateColumn(column, currentElement) {
        const sortedParam = document.querySelector('[data-order]');

        if(!sortedParam) {
            currentElement.dataset.order = 'asc';
            this.sort(column.dataset.id, 'asc');
            return;
        }

        switch (sortedParam.dataset.order) {
            case 'asc':
                currentElement.dataset.order = 'desc';
                this.sort(column.dataset.id, 'desc');
                break;
            case 'desc':
                currentElement.dataset.order = 'asc';
                this.sort(column.dataset.id, 'asc');
                break;
        }

        if(sortedParam !== currentElement) {
            sortedParam.removeAttribute('data-order');
        }
    }

    async loadData() {
        let url = this.linkAttributes(this.urlParam, '/api/rest/products');
        return await fetchJson(url);
    }

    async render() {
        const element = document.createElement('div');

        element.innerHTML = `<div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${this.templateHeader}
                </div>
                <div data-element="body" class="sortable-table__body">
                    ${this.templateBody() || ''}
                </div>
            </div>
        </div>`;

        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        this.addEvents();

        const data = await this.loadData();

        this.update(data);
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
            return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable=${item.sortable} >
                <span>${item.title}</span>
                ${this.templateArrow}
            </div>`;
        }).join('');
    }

    get templateArrow() {
        return `<span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>`;
    }

    templateBody(data = this.data) {
        return data && data.map(item => {
            const image = item.images ? `<div class="sortable-table__cell">
                <img class="sortable-table-image" alt="Image" src="${item.images[0].url}">
            </div>` : '';
            const quantity = item.quantity ? `<div class="sortable-table__cell">${item.quantity}</div>` : '';
            const sales = item.sales ? `<div class="sortable-table__cell">${item.sales}</div>` : '';

            return `<a href="/products/${item.id}" class="sortable-table__row">
                ${image}
                <div class="sortable-table__cell">${item.title}</div>
                ${quantity}
                <div class="sortable-table__cell">${item.price}</div>
                ${sales}
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

    urlParam = {
        '_embed': 'subcategory.category',
        '_sort': 'title',
        '_order': 'asc',
        '_start': 1,
        '_end': 60
    };

    addEvents() {
        let sortedColumn = '';

        // console.log(this.subElements.header);

        this.subElements.header.addEventListener('pointerdown',(event) => {
            // this.updateColumn(column, event.target);

            const element = event.target.closest('[data-id]').dataset;

            this.urlParam['_sort'] = element.id;
            this.urlParam['_order'] = element.order || 'asc';

            this.sortOnServer('title', 'desc');
        });

        this.status = true;

        const downloadData = () => {
            let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

            if (windowRelativeBottom < document.documentElement.clientHeight + 10 && this.status) {
                this.status = false;

                this.urlParam['_start'] += 60;
                this.urlParam['_end'] += 60;

                this.sortOnServer('title', 'desc');
            }
        }

        window.addEventListener('scroll', downloadData, null, {passive: true});
    }
    async sortOnServer(id, sort) {
        const data = await this.loadData();

        this.update(data);
    }

    linkAttributes(attr, path = this.url) {
        const url = new URL(path, BACKEND_URL);

        for (const [key, value] of Object.entries(attr)) {
            url.searchParams.set(key, value);
        }

        return url.href;
    }
}


