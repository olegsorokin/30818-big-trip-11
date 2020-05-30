import AbstractComponent from "./abstract-component";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItem = {
  NEW_POINT: `control__new-task`,
  STATS: `Stats`,
  TABLE: `Table`,
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" data-menu-item="${MenuItem.TABLE}" href="#">Table</a>
      <a class="trip-tabs__btn" data-menu-item="${MenuItem.STATS}" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();
    this._currentPage = MenuItem.TABLE;
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    const item = Array.from(items).find((it) => it.dataset.menuItem === menuItem);
    Array.from(items).forEach((it) => {
      it.classList.remove(ACTIVE_CLASS);
    });

    if (item) {
      item.classList.add(ACTIVE_CLASS);
    } else {
      items[0].classList.add(ACTIVE_CLASS);
    }

    this._currentPage = menuItem;
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.dataset.menuItem;

      if (this._currentPage === menuItem) {
        return;
      }

      this._currentPage = menuItem;

      handler(menuItem);
    });
  }
}
