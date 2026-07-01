import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SecurityService } from 'src/common/services/security';
import { PAYMENT_METHOD, ROLE, USER_STATUS } from 'src/common/enums';

import type { IUser, IUserAddress, IUseraPayment } from 'src/common/types';

export type UserDocument = HydratedDocument<IUser>;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  timestamps: true,
  strictQuery: true,
  strict: true,
  optimisticConcurrency: true,
})
export class User implements IUser {
  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
    trim: true,
  })
  firstName!: string;

  @Prop({
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16,
    trim: true,
  })
  lastName!: string;

  @Virtual({
    set: function (this: UserDocument, value: string) {
      const [firstName, lastName] = value.split(' ');
      this.set({ firstName, lastName });
    },
    get: function (this: UserDocument) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  username?: string | undefined;
  @Prop({
    type: String,
    index: true,
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    type: String,
    select: false,

    default: null,
  })
  password!: string | null;

  @Prop({ type: [String], default: [], select: false })
  oldPasswords!: string[];

  @Prop({ type: String, default: ROLE.USER, enum: [...Object.values(ROLE)] })
  role!: ROLE;

  @Prop({
    type: String,
    unique: true,
    sparse: true,
  })
  phoneNumber?: string | null;

  @Prop({
    type: [
      {
        city: String,
        country: String,
        isDefault: Boolean,
      },
    ],
  })
  addresses?: IUserAddress[] | null | undefined;

  @Prop({
    type: [
      {
        method: { type: { enum: [...Object.values(PAYMENT_METHOD)] } },
        last4: Number,
        isDefault: Boolean,
      },
    ],
  })
  paymentsMethod?: IUseraPayment[] | null | undefined;
  @Prop({
    type: String,
    enum: [...Object.values(USER_STATUS)],
    default: USER_STATUS.ACTIVE,
  })
  status!: USER_STATUS;

  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailVerified!: boolean;

  @Prop({ type: Date, default: null })
  credentialsChangedAt!: Date | null;

  @Prop({ type: String, default: null })
  banReason?: string | null;

  @Prop({
    type: Date,
  })
  deletedAt!: Date | null;

  @Prop({
    type: Date,
  })
  restoredAt!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: (securityService: SecurityService) => {
      const schema = UserSchema;
      schema.pre(
        'save',
        async function (
          this: HydratedDocument<IUser> & { newDocument: boolean },
        ) {
          this.newDocument = this.isNew;
          if (this.isDirectModified('password')) {
            this.password = await securityService.hash(this.password as string);
          }
          if (this.isDirectModified('phoneNumber')) {
            this.phoneNumber = securityService.encrypt(
              this.phoneNumber as string,
            );
          }
        },
      );

      schema.post(
        'save',
        async function (
          this: HydratedDocument<IUser> & { newDocument: boolean },
        ) {},
      );

      schema.pre(['find', 'findOne', 'countDocuments'], function (this: any) {
        if (!(this.getOptions() as { paranoId?: boolean }).paranoId) {
          this.where({ deletedAt: null });
        }
      });

      schema.post(
        ['findOne', 'find'],
        function (
          this: any,
          docs: HydratedDocument<IUser>[] | HydratedDocument<IUser> | null,
        ) {
          if (this.op == 'find') {
            (docs as HydratedDocument<IUser>[]).forEach(
              (doc: HydratedDocument<IUser>) => {
                if (doc.phoneNumber)
                  doc.phoneNumber = securityService.decrypt(
                    doc.phoneNumber as string,
                  );
              },
            );
          } else {
            const doc = docs as HydratedDocument<IUser> | null;
            if (doc && doc.phoneNumber) {
              doc.phoneNumber = securityService.decrypt(
                doc?.phoneNumber as string,
              );
            }
          }
        },
      );

      schema.pre(['updateOne', 'findOneAndUpdate'], function () {
        const update = this.getUpdate() as HydratedDocument<IUser>;
        if (update.deletedAt) {
          this.setUpdate({ ...update, $unset: { restoredAt: 1 } });
        }
        if (update.restoredAt) {
          this.setUpdate({ ...update, $unset: { deletedAt: 1 } });
          this.setQuery({ deletedAt: { $exists: false }, ...this.getQuery() });
        }
        const query = this.getQuery();
        const options = this.getOptions();
        if (options.paranoId) {
          this.setQuery({ ...query });
        } else {
          this.setQuery({ ...query, deletedAt: { $exists: false } });
        }
      });

      return schema;
    },
    inject: [SecurityService],
  },
]);
