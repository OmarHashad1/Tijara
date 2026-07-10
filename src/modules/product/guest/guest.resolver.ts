import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class GuestResolver {
  @Query((returns) => String)
  sayHi() {
    return 'Hi there!';
  }
}
