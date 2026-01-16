import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity('guests')
@Unique(['document', 'reservationId'])
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'guest_name', length: 100 })
  guestName: string;

  @Column({ name: 'document', length: 20 })
  document: string;

  @Column({ name: 'document_type', length: 10 })
  documentType: 'CPF' | 'PASSPORT';

  @Column({ name: 'reservation_id' })
  reservationId: string;

  @ManyToOne(() => Reservation, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
