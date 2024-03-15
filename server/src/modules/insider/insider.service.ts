import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma'
import { CreateInsiderDto } from './dto/create-insider.dto'
import { UpdateInsiderDto } from './dto/update-insider.dto'
import { IsDel } from '@prisma/client'

@Injectable()
export class InsiderService {
  constructor(private readonly prismaService: PrismaService) {}

  async preCreate(createInsiderDto: CreateInsiderDto, createBy: string) {
    const { app, platform, email } = createInsiderDto
    const insider = await this.prismaService.insider.findFirst({
      select: {
        id: true,
        app: true,
        platform: true,
        email: true,
        create_date: true,
        create_by: true,
        user: {
          select: {
            username: true,
            nickname: true,
          },
        },
      },
      where: {
        app,
        platform,
        email,
        create_by: createBy,
        is_del: IsDel.NO,
      },
    })

    if (!insider) {
      throw new NotFoundException()
    }

    return insider
  }

  async create(createInsiderDto: CreateInsiderDto, createBy: string) {
    const { app, platform, email } = createInsiderDto
    return this.prismaService.insider.create({
      data: {
        app,
        platform,
        email,
        create_by: createBy,
        update_by: createBy,
      },
      select: {
        id: true,
        app: true,
        platform: true,
        email: true,
        create_date: true,
        create_by: true,
        user: {
          select: {
            username: true,
            nickname: true,
          },
        },
      },
    })
  }

  async findAll(createBy: string | null) {
    return this.prismaService.insider.findMany({
      select: {
        id: true,
        app: true,
        platform: true,
        email: true,
        create_date: true,
        create_by: true,
        user: {
          select: {
            username: true,
            nickname: true,
          },
        },
      },
      where: {
        ...(createBy ? { create_by: createBy } : {}),
        is_del: IsDel.NO,
      },
    })
  }

  async findOne(id: string, createBy: string) {
    const insider = await this.prismaService.insider.findFirst({
      select: {
        id: true,
        app: true,
        platform: true,
        email: true,
        create_date: true,
        create_by: true,
        user: {
          select: {
            username: true,
            nickname: true,
          },
        },
      },
      where: {
        id,
        create_by: createBy,
        is_del: IsDel.NO,
      },
    })

    if (!insider) {
      throw new NotFoundException()
    }

    return insider
  }

  async update(
    id: string,
    updateInsiderDto: UpdateInsiderDto,
    updateBy: string,
  ) {
    const { app, platform, email } = updateInsiderDto
    const insider = await this.prismaService.insider.update({
      data: {
        app,
        platform,
        email,
        update_by: updateBy,
      },
      select: {
        id: true,
        app: true,
        platform: true,
        email: true,
        create_date: true,
        create_by: true,
        user: {
          select: {
            username: true,
            nickname: true,
          },
        },
      },
      where: {
        id,
        create_by: updateBy,
        is_del: IsDel.NO,
      },
    })

    if (!insider) {
      throw new NotFoundException()
    }

    return insider
  }

  async remove(id: string, updateBy: string) {
    const insider = await this.prismaService.insider.update({
      data: {
        is_del: IsDel.YES,
        update_by: updateBy,
      },
      select: {
        id: true,
        app: true,
        platform: true,
        email: true,
        create_date: true,
        create_by: true,
        user: {
          select: {
            username: true,
            nickname: true,
          },
        },
      },
      where: {
        id,
        create_by: updateBy,
        is_del: IsDel.NO,
      },
    })

    if (!insider) {
      throw new NotFoundException()
    }

    return insider
  }
}
