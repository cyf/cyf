import { Dictionary as DictionaryModel } from '@prisma/client'

export type Insider = Omit<DictionaryModel, 'is_del'>
