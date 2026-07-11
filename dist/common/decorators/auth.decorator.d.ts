import { ROLE } from "../enums";
import { TOKEN_TYPE } from "../enums/auth.enum";
export declare const Auth: (roles: ROLE[], tokenTypeVal?: TOKEN_TYPE) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
