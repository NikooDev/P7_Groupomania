import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Photo extends BaseModel {
  @column()
  public id: string = uuid()

  @column()
  public userId: string = uuid()

  //@column()
  //public albumId: string = uuid()

  @column()
  public postId: string = uuid()

  @column()
  public photoUrl: string

  @column()
  public photoTitle: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
