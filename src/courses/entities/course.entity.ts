import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Category } from "../../entities/category.entity"

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

    @Column({ type: "uuid", nullable: true })
    categoryId: string

    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: "categoryId" })
    category: Category

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}