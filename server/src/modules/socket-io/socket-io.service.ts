import { Injectable } from '@nestjs/common'
import { CreateSocketIoDto } from './dto/create-socket-io.dto'
import { UpdateSocketIoDto } from './dto/update-socket-io.dto'
import { PrismaService } from '@/modules/prisma'

@Injectable()
export class SocketIoService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createSocketIoDto: CreateSocketIoDto) {
    return 'This action adds a new socketIo'
  }

  findAll() {
    return `This action returns all socketIo`
  }

  findOne(id: number) {
    return `This action returns a #${id} socketIo`
  }

  update(id: number, updateSocketIoDto: UpdateSocketIoDto) {
    return `This action updates a #${id} socketIo`
  }

  remove(id: number) {
    return `This action removes a #${id} socketIo`
  }
}
