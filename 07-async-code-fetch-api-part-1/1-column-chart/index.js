import fetchJson from './utils/fetch-json.js';

const globalUrl = 'https://course-js.javascript.ru';

export default class ColumnChart{
    static dashboards = {};
    static dashboardElements = {};

    subElements = {};

    constructor({
        url = '',
        range = {
            from: new Date(Date.now() - 365),
            to: Date.now(),
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

        ColumnChart.dashboards[label] = url;
        ColumnChart.dashboardElements[label] = this;

        this.render();

        this.loadData(this.range.from, this.range.to);
    }

    async loadData(dateFrom, dateTo, component, flag) {
        const attr = {
            from: dateFrom.toISOString(),
            to: dateTo.toISOString()
        }

        const link = this.linkAttributes(attr, this.url);

        const data = await fetchJson(link);


        if (flag) {
            this.updateS(dateFrom, dateTo);
        }

        if(component) {
            component.data =  Object.values(data);
        } else {
            this.data = Object.values(data);
            this.getList(this.data);
        }
    }

    updateS(dateFrom, dateTo) {
        const dashboardsData = {};

        for (const [key, value] of Object.entries(ColumnChart.dashboards)) {
            dashboardsData[key] = this.loadData(dateFrom, dateTo, ColumnChart.dashboardElements[key]);
        }
    }

    async update(dateFrom, dateTo) {
        const wait =  await this.loadData(dateFrom, dateTo, '', true);
    }

    linkAttributes(attr, path = this.url) {
        const url = new URL(path, globalUrl);

        for (const [key, value] of Object.entries(attr)) {
            url.searchParams.set(key, value);
        }

        return url.href;
    }

    getList(data = {}) {
        const maxElement = this.data && Math.max(...this.data);
        const list = this.data && this.data.reduce((list,item) => {
            const value = item * (this.chartHeight / maxElement);
            const persent = item / maxElement * 100;

            return list + `<div style="--value: ${Math.floor(value)}" data-tooltip="${persent.toFixed()}%"></div>`
        }, '');

        if (Object.values(data).length) {
            this.element.classList.add('column-chart_loading');
            this.subElements.body.innerHTML = list;
            this.subElements.header.innerHTML = this.data.reduce((accum, item) => (accum + item), 0);
            this.element.classList.remove('column-chart_loading');

            return;
        }

        return list;
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


    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    render() {
        const element = document.createElement('div');

        element.innerHTML = `
            <div class="column-chart ${this.data ? '' : 'column-chart_loading'}" style="--chart-height: 50">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink() || ''}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header"></div>
                    <div data-element="body" class="column-chart__chart">${this.getList() || ''}</div>
                </div>
            </div>`
        ;

        this.element = element.firstElementChild;

        this.subElements = this.getSubElements(this.element);
    }
}

