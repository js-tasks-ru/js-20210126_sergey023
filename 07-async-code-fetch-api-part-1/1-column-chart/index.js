import fetchJson from './utils/fetch-json.js';

const globalUrl = 'https://course-js.javascript.ru';

export default class ColumnChart{
    subElements = {};

    constructor({
        url = '',
        range = {
            from: new Date(),
            to: new Date(),
        },
        value = 0,
        label = '',
        link,
        formatHeading
    } = {}) {
        this.url = url;
        this.label = label;
        this.value = value;
        this.link = link;
        this.range = range;
        this.formatHeading = formatHeading;
        this.chartHeight = 50;

        this.render();
        this.loadData(this.range.from, this.range.to);
    }

    async loadData(dateFrom, dateTo) {
        const attr = {
            from: dateFrom.toISOString(),
            to: dateTo.toISOString()
        }

        const link = this.linkAttributes(attr, this.url);
        const data = await fetchJson(link);

        this.getList(Object.values(data));
    }

    async update(dateFrom, dateTo) {
        await this.loadData(dateFrom, dateTo);
    }

    linkAttributes(attr, path = this.url) {
        const url = new URL(path, globalUrl);

        for (const [key, value] of Object.entries(attr)) {
            url.searchParams.set(key, value);
        }

        return url.href;
    }

    getList(data) {
        const maxElement = data && Math.max(...data);
        const list = data && data.reduce((list,item) => {
            const value = item * (this.chartHeight / maxElement);
            const persent = item / maxElement * 100;

            return list + `<div style="--value: ${Math.floor(value)}" data-tooltip="${persent.toFixed()}%"></div>`
        }, '');

        if (data.length){
            this.element.classList.add('column-chart_loading');
            this.subElements.body.innerHTML = list;
            this.subElements.header.innerHTML = data.reduce((accum, item) => (accum + item), 0);
            this.element.classList.remove('column-chart_loading');
        }
    }

    getLink() {
        return this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>`  : '';
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');

        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;

          return accum;
        }, {});
    }

    render() {
        const element = document.createElement('div');

        element.innerHTML = `
            <div class="column-chart column-chart_loading" style="--chart-height: 50">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink() || ''}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header"></div>
                    <div data-element="body" class="column-chart__chart"></div>
                </div>
            </div>`
        ;

        this.element = element.firstElementChild;

        this.subElements = this.getSubElements(this.element);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}

