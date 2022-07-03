import Photo from 'App/Models/Photo'
import Comment from 'App/Models/Comment'
import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class Post extends BaseModel {
  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Photo)
  public photos: HasMany<typeof Photo>

  @column({ isPrimary: true })
  public id: string = uuid()

  @column()
  public userId: string = uuid()

  @column()
  public postText: string

  @column()
  public withPicture: boolean

  @column()
  public usersLiked: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
