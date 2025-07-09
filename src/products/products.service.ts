import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      if (!createProductDto.slug) {
        createProductDto.slug = createProductDto.title
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
      } else {
        createProductDto.slug = createProductDto.slug
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
      }

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.productRepository.find({});
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {}

  async remove(id: string) {
    //? Other option - only one request
    // const result = await this.productRepository.delete({ id });
    // if (!result.affected) throw new NotFoundException();
    // return id;

    //? Other option - two requests (find and then remove)
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
