import { Injectable } from '@nestjs/common'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { DictionaryService } from '@/modules/dictionary'

@ValidatorConstraint({ name: 'IsInDatabaseConstraint', async: true })
@Injectable()
export class IsInDatabaseConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly dictionaryService: DictionaryService) {}

  async validate(value: string, args: ValidationArguments) {
    console.log('value', value, 'args', args)
    const primary = args.property
    const dictionaries = await this.dictionaryService.findAllByPrimary(primary)
    const keys = dictionaries.map((dictionary) => dictionary.key)
    return keys.includes(value)
  }
}

export function IsInDatabase(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInDatabaseConstraint,
    })
  }
}
