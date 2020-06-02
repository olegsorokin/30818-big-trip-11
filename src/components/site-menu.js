import AbstractComponent from "./abstract-component";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const toggleMenu = (container, currentPage) => {
  const buttons = container.getElement()
    .querySelectorAll(`.trip-tabs__btn`);

  Array.from(buttons)
    .forEach((btn) => {
      if (btn.dataset.menuItem === currentPage) {
        btn.classList.add(ACTIVE_CLASS);
      } else {
        btn.classList.remove(ACTIVE_CLASS);
      }
    });

  return currentPage;
};

export const MenuItem = {
  NEW_POINT: `new`,
  TABLE: `table`,
  STATS: `stats`,
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

    this._currentPage = toggleMenu(this, MenuItem.TABLE);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    this._currentPage = toggleMenu(this, menuItem);
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.dataset.menuItem;

      this._currentPage = toggleMenu(this, menuItem);

      handler(menuItem);
    });
  }
}
