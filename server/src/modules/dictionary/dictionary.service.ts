import { Injectable, NotFoundException } from '@nestjs/common'
import { IsDel } from '@prisma/client'
import { PrismaService } from '@/modules/prisma'
import { CreateDictionaryDto } from './dto/create-dictionary.dto'
import { UpdateDictionaryDto } from './dto/update-dictionary.dto'
import { ExistedException } from '@/common/exception/existed.exception'

@Injectable()
export class DictionaryService {
  constructor(private readonly prismaService: PrismaService) {}

  async preCreate(createDictionaryDto: CreateDictionaryDto) {
    const { primary, key } = createDictionaryDto
    const dictionary = await this.prismaService.dictionary.findFirst({
      select: {
        id: true,
        primary: true,
        key: true,
        label: true,
        description: true,
        create_date: true,
        create_by: true,
      },
      where: {
        primary,
        key,
        is_del: IsDel.NO,
      },
    })

    if (dictionary) {
      throw new ExistedException()
    }

    return dictionary
  }

  async create(createDictionaryDto: CreateDictionaryDto, createBy: string) {
    const { primary, key, label, description } = createDictionaryDto
    return this.prismaService.dictionary.create({
      data: {
        primary,
        key,
        label,
        description,
        create_by: createBy,
        update_by: createBy,
      },
      select: {
        id: true,
        primary: true,
        key: true,
        label: true,
        description: true,
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

  async findAll() {
    return this.prismaService.dictionary.findMany({
      select: {
        id: true,
        primary: true,
        key: true,
        label: true,
        description: true,
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
        is_del: IsDel.NO,
      },
    })
  }

  async findAllPrimary() {
    const dictionaries = await this.prismaService.dictionary.findMany({
      select: {
        primary: true,
      },
      where: {
        is_del: IsDel.NO,
      },
    })

    return Array.from(
      new Set(dictionaries.map((dictionary) => dictionary?.primary)),
    )
  }

  async findOne(id: string, createBy: string) {
    const dictionary = await this.prismaService.dictionary.findFirst({
      select: {
        id: true,
        primary: true,
        key: true,
        label: true,
        description: true,
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

    if (!dictionary) {
      throw new NotFoundException()
    }

    return dictionary
  }

  async update(
    id: string,
    updateDictionaryDto: UpdateDictionaryDto,
    updateBy: string,
  ) {
    const { primary, key, label, description } = updateDictionaryDto
    const dictionary = await this.prismaService.dictionary.update({
      data: {
        primary,
        key,
        label,
        description,
        update_by: updateBy,
      },
      select: {
        id: true,
        primary: true,
        key: true,
        label: true,
        description: true,
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

    if (!dictionary) {
      throw new NotFoundException()
    }

    return dictionary
  }

  async remove(id: string, updateBy: string) {
    const dictionary = await this.prismaService.dictionary.update({
      data: {
        is_del: IsDel.YES,
        update_by: updateBy,
      },
      select: {
        id: true,
        primary: true,
        key: true,
        label: true,
        description: true,
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

    if (!dictionary) {
      throw new NotFoundException()
    }

    return dictionary
  }
}
