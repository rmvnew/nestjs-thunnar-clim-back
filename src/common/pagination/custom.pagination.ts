interface PaginationFilter {
    page: number;
    limit: number;
}

interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

interface PaginationLinks {
    first: string;
    previous: string;
    next: string;
    last: string;
}

interface PaginationResult<T> {
    message?: string;
    items: T[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

export function customPagination<T>(
    items: T[],
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
    basePath: string,
    sort?: string,
    orderBy?: string
): PaginationResult<T> {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const meta: PaginationMeta = {
        totalItems,
        itemCount: items.length,
        itemsPerPage,
        totalPages,
        currentPage,
    };

    const links = createLinks(currentPage, totalPages, basePath, sort, orderBy);

    return { items, meta, links };
}

function createLinks(
    currentPage: number,
    totalPages: number,
    basePath: string,
    sort?: string,
    orderBy?: string
): PaginationLinks {
    const querySuffix = sort && orderBy ? `&sort=${sort}&orderBy=${orderBy}` : '';
    return {
        first: currentPage > 1 ? `${basePath}?page=1${querySuffix}` : '',
        previous: currentPage > 1 ? `${basePath}?page=${currentPage - 1}${querySuffix}` : '',
        next: currentPage < totalPages ? `${basePath}?page=${currentPage + 1}${querySuffix}` : '',
        last: currentPage < totalPages ? `${basePath}?page=${totalPages}${querySuffix}` : '',
    };
}