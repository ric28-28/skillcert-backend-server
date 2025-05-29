import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common"
import type { User } from "../entities/user.entity"
import * as bcrypt from "bcrypt"
import { CreateUserDto } from "../dto/create-user.dto"
import { UsersRepository } from "../users.repository"
import { UpdateUserDto } from "../dto/update-user.dto"

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const emailExists = await this.usersRepository.emailExists(createUserDto.email)
    if (emailExists) {
      throw new ConflictException("Email already exists")
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds)

    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    }

    return await this.usersRepository.create(userWithHashedPassword)
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll()
  }

  async findById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException("User ID is required")
    }

    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new BadRequestException("User ID is required")
    }

    // Check if user exists
    const userExists = await this.usersRepository.exists(id)
    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email) {
      const emailExists = await this.usersRepository.emailExists(updateUserDto.email, id)
      if (emailExists) {
        throw new ConflictException("Email already exists")
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      const saltRounds = 10
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds)
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto)
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return updatedUser
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException("User ID is required")
    }

    const userExists = await this.usersRepository.exists(id)
    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    const deleted = await this.usersRepository.delete(id)
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }
}
