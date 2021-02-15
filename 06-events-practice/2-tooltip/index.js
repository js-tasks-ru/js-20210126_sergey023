class Tooltip {
    static element = true;

    template(content) {
        return `<div class="tooltip">${content}</div>`;
    }

    initialize() {
        document.addEventListener('pointerover', (event) => {
            const tooltipMessage = event.target.dataset.tooltip;

            if(tooltipMessage && Tooltip.element){
                this.render(tooltipMessage);

                Tooltip.element = false;
            }
        });

        document.addEventListener('pointermove', (event) => {
            const tooltipMessage = event.target.dataset.tooltip;

            if(tooltipMessage) {
                const position = {
                    top: (event.clientY + 20).toFixed(),
                    left: (event.clientX + 20).toFixed(),
                }

                this.initPosition(position);
            }
        });

        document.addEventListener('pointerout', (event)    => {
            if(event.target.dataset.tooltip) {
                this.destroy();
            }
        });
    }

    render(tooltipMessage = '') {
        const element = document.createElement('div');
        element.innerHTML = this.template(tooltipMessage);

        this.element = element.firstElementChild;

        document.body.append(this.element);
    }

    initPosition({top = 0, left = 0} = {}) {
        this.element.setAttribute('style', `top: ${top}px; left:${left}px`)
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        Tooltip.element = true;
    }
}

const tooltip = new Tooltip();

export default tooltip;
