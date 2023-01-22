import { Constants } from './constants';

export class Helper {
  static parseBoolean = function (input) {
    switch (String(input).toLowerCase()) {
      case 'true':
      case 'yes':
      case 'y':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case 'n':
        return false;
      default:
        return undefined;
    }
  };

  static validatePagination = function (
    params,
    {
      sort_items = Constants.VALID_SORT_KEYS,
      max_size = Constants.DEFAULT_PAGESIZE,
    } = {},
  ) {
    if (!params.page_size) {
      params.page_size = max_size;
    } else {
      params.page_size = Number(params.page_size);
    }

    if (!params.page_number) {
      params.page_number = Constants.DEFAULT_PAGENUM;
    } else {
      params.page_number = Number(params.page_number);
    }

    if (!params.sort_by || !sort_items.includes(params.sort_by)) {
      params.sort_by = sort_items[0];
    }

    if (
      !params.ascending ||
      (params.ascending != 'true' && params.ascending != 'false')
    ) {
      params.ascending = Constants.DEFAULT_ORDER;
    } else {
      if (params.ascending == 'true') {
        params.ascending = 'asc';
      } else {
        params.ascending = 'desc';
      }
    }

    if (params.is_active) {
      params.is_active = Helper.parseBoolean(params.is_active);
    }

    if (params._id) {
      params._id = Number(params._id);
    }

    const limit = params.page_size;

    return {
      queryPart: {
        skip: (params.page_number - 1) * params.page_size,
        limit,
        sort: {
          [params.sort_by]: params.ascending,
        },
      },
      ...params,
    };
  };
}
