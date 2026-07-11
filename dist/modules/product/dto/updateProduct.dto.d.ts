import { CreateProductDto } from './createProduct.dto';
declare const UpdateProductDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateProductDto, "stock">>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
export {};
