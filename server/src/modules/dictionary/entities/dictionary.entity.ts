import { Dictionary as DictionaryModel } from '@prisma/client'

export type Dictionary = Omit<DictionaryModel, 'is_del'>
