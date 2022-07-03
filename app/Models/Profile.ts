import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Profile extends BaseModel {
  @column()
  public id: string = uuid()

  @column()
  public userId: string = uuid()

  @column()
  public firstname: string

  @column()
  public name: string

  @column()
  public status: string

  @column()
  public darkmode: boolean

  @column()
  public coverUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
