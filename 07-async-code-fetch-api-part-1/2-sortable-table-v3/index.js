import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    subElements = {};
    enableLoad = true;
    sortOnServerState = true;

    urlParam = {
        '_embed': 'subcategory.category',
        '_sort': null,
        '_order': 'asc',
        '_start': 1,
        '_end': 60
    };

    constructor(header = [], {data} = []) {
        this.header = header;
        this.data = [];
        this.url = '/api/rest/products';

        this.render();
    }

    async render() {
        const element = document.createElement('div');

        element.innerHTML = this.template();

        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        const data = await this.loadData();

        this.update(data);
        this.showArrow();
        this.addEvents();
    }

    async loadData() {
        let url = this.linkAttributes(this.urlParam, this.url);

        return await fetchJson(url);
    }

    linkAttributes(attr, path = this.url) {
        const url = new URL(path, BACKEND_URL);

        for (const [key, value] of Object.entries(attr)) {
            url.searchParams.set(key, value);
        }

        return url.href;
    }

    update(data) {
        this.data = [...this.data, ...data];
        this.subElements.body.insertAdjacentHTML('beforeend', this.templateBody(data));
        this.enableLoad = true;
    }

    updateSort(data) {
        this.data = [...data];
        this.subElements.body.innerHTML = '';
        this.subElements.body.insertAdjacentHTML('beforeend', this.templateBody(data));
        this.enableLoad = true;
    }

    template() {
        return `<div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${this.templateHeader()}
                </div>
                <div data-element="body" class="sortable-table__body"></div>
            </div>
        </div>`;
    }

    templateHeader() {
        return this.header.map(item => {
            if (item.sortable && !this.urlParam['_sort']) {
                this.urlParam['_sort'] = item.id;
            }

            return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable=${item.sortable} >
                <span>${item.title}</span>
                <span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>
            </div>`;
        }).join('');
    }

    templateBody(data = this.data) {
        const body = [];

        data.forEach((element, index) => {
            body.push(`<a href="/products/${element.id}" class="sortable-table__row">`);

            this.header.forEach(item => {
                if (item.template) {
                    const data = element[item.id];
                    body.push(item.template(data))
                } else {
                    body.push(`<div class="sortable-table__cell">${element[item.id]}</div>`);
                }

            });

            body.push(`</a>`);
        });

        return body.join('');
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');

        return [...elements].reduce((obj, subElement) => {
            obj[subElement.dataset.element] = subElement;

            return obj;
        }, {});
    }

    async sortOnServer(id, sort) {
        this.urlParam['_sort'] = id;
        this.urlParam['_order'] = sort;

        const data = await this.loadData();

        this.updateSort(data);
    }

    addEvents() {
        this.subElements.header.addEventListener('pointerdown',(event) => {
            const field = event.target.closest('[data-id]');

            if (field.dataset.sortable === 'false') {
                return;
            }

            const sort = this.urlParam['_order'] === 'asc' ? 'desc' : 'asc';

            if (this.sortOnServerState) {
                this.sortOnServer(field.dataset.id, sort);
            } else {
                this.sort(field.dataset.id, sort);
            }

            this.updateArrow();
        });

        const downloadData =  async () => {
            let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

            if (windowRelativeBottom < document.documentElement.clientHeight + 10 && this.enableLoad) {
                this.enableLoad = false;

                this.urlParam['_start'] += 60;
                this.urlParam['_end'] += 60;

                const data = await this.loadData();

                this.update(data);
            }
        }

        window.addEventListener('scroll', downloadData, null, {passive: true});
    }


    sort(field = 'title', param = 'asc') {
        this.urlParam['_sort'] = field;
        this.urlParam['_order'] = param;

        const method = {
            asc: 1,
            desc: -1
        }

        param = method[param];

        const data = this.data.sort((str1, str2) => {
            if (isNaN(str1[field]) && isNaN(str2[field])) {
                return str1[field].localeCompare(str2[field], ['ru', 'en'], {caseFirst: 'upper'}) * param;
            } else {
                return (str1[field] - str2[field]) * param;
            }
        });

        this.subElements.body ? this.subElements.body.innerHTML = this.templateBody(data) : '';
    }

    showArrow() {
        const selector = `[data-id="${this.urlParam['_sort']}"]`;
        const activeItem = document.querySelector(selector);

        activeItem.dataset.order = this.urlParam['_order'];
    }

    updateArrow() {
        const currentElement = document.querySelector('[data-order]');
        currentElement && currentElement.removeAttribute('data-order');

        this.showArrow();
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

