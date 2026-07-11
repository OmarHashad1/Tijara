import { TOKEN_TYPE } from "../enums/auth.enum";
export declare const tokenTypeName = "tokenType";
export declare const Token: (tokenTtypeVal?: TOKEN_TYPE) => import("@nestjs/common").CustomDecorator<string>;
