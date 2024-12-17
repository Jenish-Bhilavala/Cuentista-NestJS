export async function pagination(
  model: any,
  page?: number,
  pageSize?: number,
  options: any = {},
  dataKey: string = 'data'
) {
  let result = null;

  if (!page || !pageSize) {
    result = await model.findAndCountAll(options);
  } else {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const queryOptions = {
      ...options,
      offset,
      limit,
    };

    result = await model.findAndCountAll(queryOptions);
  }

  return {
    [dataKey]: result.rows,
    totalItems: result.count,
    totalPage: Math.ceil(result.count / pageSize) || 1,
    currentPage: page,
    pageSize,
    numberOfRows: result.rows.length,
  };
}

export function sorting(sortKey: string = 'id', sortValue: string = 'asc') {
  const sortQuery: [string, string][] = [];

  if (sortKey && sortValue) {
    if (sortValue === 'asc' || sortValue === 'desc') {
      sortQuery.push([sortKey, sortValue.toUpperCase()]);
    }
  } else {
    sortQuery.push(['id', 'desc']);
  }
  return sortQuery;
}
