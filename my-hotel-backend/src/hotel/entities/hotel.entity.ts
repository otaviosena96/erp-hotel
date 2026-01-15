import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  Generated, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('increment')
  code: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  city: string;

  @Column({ name: 'room_quantity', type: 'int' })
  roomQuantity: number;

  @Column({ type: 'int', default: 3 })
  stars: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}