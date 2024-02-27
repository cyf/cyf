export class Dater {
  create_date: Date
  update_date: Date
  is_del: string
}

export class CommonEntity extends Dater {
  create_by: string
  update_by: string
}
