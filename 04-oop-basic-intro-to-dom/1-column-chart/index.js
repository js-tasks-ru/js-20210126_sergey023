export default class ColumnChart {
    constructor(args) {
        Object.assign(this, args);

        this.chartHeight = 50;
        this.render();
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
                    <div data-element="header" class="column-chart__header">${this.value}</div>
                    <div data-element="body" class="column-chart__chart">${this.getList() || ''}</div>
                </div>
            </div>`
        ;

        this.element = element.firstElementChild;
    }

    getList(newData) {
        const maxElement = this.data && Math.max(...this.data);
        const list = this.data && this.data.reduce((list,item) => {
            const value = item * (this.chartHeight / maxElement);
            const persent = item / maxElement * 100;

            return list + `<div style="--value: ${Math.floor(value)}" data-tooltip="${persent.toFixed()}%"></div>`
        }, '');

        if (newData) {
            const element = document.querySelector('[data-element = "body"]');

            element.innerHTML = list;

            this.element = element.firstElementChild;

            return;
        }

        return list;
    }

    getLink() {
        return this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>`  : '';
    }

    update(updatedData) {
        this.data = updatedData;

        this.getList(this.data);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
