import { Insider as InsiderModel } from '@prisma/client'

export type Insider = Omit<InsiderModel, 'is_del'>
