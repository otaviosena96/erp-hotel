import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hotel_id' })
  hotelId: string;

  @ManyToOne(() => Hotel, { eager: true })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ name: 'check_in', type: 'date' })
  checkIn: Date;

  @Column({ name: 'check_out', type: 'date' })
  checkOut: Date;

  @Column({ name: 'responsible_name', length: 100 })
  responsibleName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
