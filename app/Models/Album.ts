import Photo from 'App/Models/Photo'
import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Album extends BaseModel {
  @hasMany(() => Photo)
  public photos: HasMany<typeof Photo>

  @column({ isPrimary: true })
  public id: string = uuid()

  @column()
  public userId: string = uuid()

  @column()
  public albumTitle: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
