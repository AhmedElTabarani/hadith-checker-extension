export const convertOptionsToQueryString = (options) =>
  Object.values(options)
    .map((option) => {
      if (Array.isArray(option.value))
        return option.value
          .map((value) => `${option.id}=${value}`)
          .join('&');
      else return `${option.id}=${option.value}`;
    })
    .join('&');
