export declare class ProductEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPercent: number;
    categoryId: string;
    brandId: string;
    images: string[];
}
export declare class ProductListMeta {
    count?: number;
    page?: number;
    size?: number;
    pages?: number;
}
export declare class PaginatedProducts {
    docs: ProductEntity[];
    meta: ProductListMeta;
}
