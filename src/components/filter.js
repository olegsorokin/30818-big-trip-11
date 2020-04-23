const createFilterMarkup = (filter, isChecked) => {
  const checked = isChecked ? `checked` : ``;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${checked}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`
  );
};

export const createFilterTemplate = (filters) => {
  const filtersMarkup = filters
    .map((filter, index) => createFilterMarkup(filter, index === 0))
    .join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
