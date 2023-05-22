import { convertOptionsToQueryString } from '../utils/adapters/convertOptionsToQueryString.js';
import { loadFromStorage } from '../utils/adapters/loadFromStorage.js';
import { saveToStorage } from '../utils/adapters/saveToStorage.js';
import { bukhariOptions } from '../utils/options/bukhariOptions.js';
import { defaultOptions } from '../utils/options/defaultOptions.js';
import { muslimOptions } from '../utils/options/muslimOptions.js';

class QueryOptions {
  async init() {
    this.options = await loadFromStorage('options');
    if (!this.options) {
      await saveToStorage('options', defaultOptions);
      this.options = defaultOptions;
    }
    return this;
  }

  updateOption = (key, value) => {
    this.options[key].value = value;
  };

  getOption = (key) => {
    return this.options[key].value;
  };

  getAllOptions = () => {
    return this.options;
  };

  getDefaultOptions = () => {
    return defaultOptions;
  };

  resetOptions = () => {
    return saveToStorage('options', defaultOptions);
  };

  saveOptions = () => {
    return saveToStorage('options', this.options);
  };

  isChanged = (key = 'all', useJsonStringify = true) => {
    if (key === 'all')
      return (
        JSON.stringify(this.options) !==
        JSON.stringify(defaultOptions)
      );

    if (useJsonStringify)
      return (
        JSON.stringify(this.options[key].value) !==
        JSON.stringify(defaultOptions[key].value)
      );

    return this.options[key].value !== defaultOptions[key].value;
  };

  convertOptionsToQueryString = (tabId) => {
    if (tabId === 'bukhari-tab')
      return convertOptionsToQueryString(
        Object.assign(
          { ...defaultOptions, specialist: this.options.specialist },
          bukhariOptions,
        ),
      );
    else if (tabId === 'muslim-tab')
      return convertOptionsToQueryString(
        Object.assign(
          { ...defaultOptions, specialist: this.options.specialist },
          muslimOptions,
        ),
      );
    else if (tabId === 'main-tab')
      return convertOptionsToQueryString(this.options);

    return convertOptionsToQueryString(defaultOptions);
  };
}

export default await new QueryOptions().init();
