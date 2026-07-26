import type {CatalogFilters} from '../../../app/types/catalog'
import {delay, products} from '../../utils/mock-data'

export default defineEventHandler(async event => {
    await delay();
    const q = getQuery(event);
    const page = Number(q.page || 1), pageSize = Number(q.pageSize || 12);
    let filters: CatalogFilters = {types: [], sides: [], lengths: [], mounts: []};
    try {
        if (q.filters) filters = JSON.parse(String(q.filters))
    } catch {
    }
    let list = [...products];
    if (filters.types.length) list = list.filter(x => filters.types.includes(x.type));
    if (filters.sides.length) list = list.filter(x => filters.sides.includes(x.side));
    if (filters.lengths.length) list = list.filter(x => filters.lengths.includes(x.length));
    if (filters.mounts.length) list = list.filter(x => filters.mounts.includes(x.mount));
    return {
        data: {
            items: list.slice((page - 1) * pageSize, page * pageSize),
            total: list.length,
            page,
            pageSize,
            pages: Math.ceil(list.length / pageSize)
        }
    }
})
