export default class NotificationMessage {
    static message = null;
    static timeout = null;

    constructor(message = '', {
        duration = 2000,
        type = 'success'
    } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.show();
    }

    get template() {
        return `<div class="notification ${this.type}" style="--value:${this.duration}ms">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">${this.message}</div>
            </div>
        </div>`;
    }

    show(container = '') {
        this.destroy();
        this.remove();

        const element = container || document.createElement('div');

        element.innerHTML = this.template;
        NotificationMessage.message = element.firstElementChild;

        this.element = element.firstElementChild;

        NotificationMessage.timeout = setTimeout(this.destroy, this.duration);
    }

    remove() {
        this.element && this.element.remove();
    }

    destroy() {
        if (NotificationMessage.message) {
            NotificationMessage.message.remove();
            NotificationMessage.message = null;
            clearTimeout(NotificationMessage.timeout);
        }
    }
}
