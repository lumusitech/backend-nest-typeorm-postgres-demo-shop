import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return 'Seed executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(({ password, ...user }) => {
      users.push(
        this.userRepository.create({
          ...user,
          password: bcrypt.hashSync(password, 10),
        }),
      );
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);
    return true;
  }
}
