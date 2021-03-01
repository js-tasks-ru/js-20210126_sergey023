export default class SortableList {

    constructor({items}) {
        this.items = items;

        this.render();
    }

    render() {
        const element = document.createElement('ul');

        element.className = 'sortable-list';
        element.innerHTML = this.items.map(item => {
            item.classList += 'sortable-list__item';
            return `${item.outerHTML}`
        }).join('');

        this.element = element;
        this.sort();
    }

    sort() {
        this.element.addEventListener('pointerdown', event => {
            const itemDelete = event.target.closest('[data-delete-handle]');

            if (!itemDelete) return;

            const item = event.target.closest('.sortable-list__item');

            if (item) {
                item.remove();
            }
        });

        this.element.addEventListener('pointerdown', event => {
            this.countItem = this.items.length;
            const dropElementButton = event.target.closest('[data-grab-handle]');

            if (!dropElementButton) return;

            event.preventDefault();

            const dropElement = event.target.closest('.sortable-list__item');
            const {height, width, x, y, } = dropElement.getBoundingClientRect();
            const shiftX = event.clientX - x;
            const shiftY = event.clientY - y;
            let {top, bottom} = dropElement.getBoundingClientRect();

            dropElement.style.position = 'fixed';
            dropElement.style.zIndex = 10;
            dropElement.style.width = `${width}px`;
            dropElement.style.left = `${event.clientX - shiftX}px`;
            dropElement.style.top = `${event.clientY - shiftY}px`;

            this.placeHolder = document.createElement('div');
            this.placeHolder.className = 'sortable-list__placeholder';
            this.placeHolder.style.height = `${height}px`;

            dropElement.before(this.placeHolder);

            const currentElement = [...this.element.children].indexOf(dropElement) - 1;

            let indexPlaceHolder = [...this.element.children].indexOf(dropElement) - 1;

            const moveAt = (event) => {
                dropElement.style.left = `${event.clientX - shiftX}px`;
                dropElement.style.top = `${event.clientY - shiftY}px`;

                let {top: currentTop, bottom: currentButtom} = dropElement.getBoundingClientRect();

                if (currentButtom - height >= bottom && indexPlaceHolder + 1 !== this.countItem) {
                    bottom = currentButtom;
                    top = currentTop;

                    indexPlaceHolder++;
                    this.placeHolder.remove();
                    this.element.children[indexPlaceHolder].after(this.placeHolder);
                }
                if (currentTop + height <= top && indexPlaceHolder !== 0) {
                    bottom = currentButtom;
                    top = currentTop;

                    indexPlaceHolder--;
                    this.placeHolder.remove();
                    this.element.children[indexPlaceHolder].before(this.placeHolder);
                }
            }

            const pointerUp = (event) => {
                if (currentElement !== indexPlaceHolder) {
                    dropElement.remove();
                    this.placeHolder.before(dropElement);
                }

                this.placeHolder.remove();

                dropElement.style.position = null;
                dropElement.style.zIndex = null;
                dropElement.style.width = null;
                dropElement.style.left = null;
                dropElement.style.top = null;
    
                document.removeEventListener('pointermove', moveAt);
                document.removeEventListener('pointerup', pointerUp);
            }

            document.addEventListener('pointermove', moveAt);
            document.addEventListener('pointerup', pointerUp);
        });
    }

    destroy() {
        this.remove();
        this.element = null;
    }
  
    remove() {
        this.element.remove();
    }

}
