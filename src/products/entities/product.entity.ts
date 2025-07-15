import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'a9f3c5d8-1b4e-4b7a-9e88-6f9c0f5d6c7b',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Imou cams kit',
    description: '4 Cams Imou',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  title: string;

  @ApiProperty({
    example: 15.5,
    description: 'Product Price - U$S',
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'Ipsum dolor in officia irure mollit ad.',
    description: 'Product description',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 'imou-cams-kit',
    description: 'Product slug for SEO',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    example: 3,
    description: 'Product stock',
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'L', 'XL'],
    description: 'Product sizes',
    isArray: true,
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'Product gender',
  })
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty({
    example: ['tag1', 'tag2', 'tag3'],
    description: 'Product tags',
    isArray: true,
  })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
    isArray: true,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
