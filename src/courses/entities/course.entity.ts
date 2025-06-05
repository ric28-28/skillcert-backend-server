import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("courses")
export class Course {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 255 })
    title: string

    @Column({ type: "text" })
    description: string

    @Column({ type: "uuid" })
    professorId: string

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "professorId" })
    professor: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}