const filterNames = [
  `everything`, `future`, `past`
];

const generateFilters = () => {
  return filterNames.map((name) => {
    return {
      name
    };
  });
};

export {generateFilters};
