import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import Profile from 'App/Models/Profile'

export default class Comment extends BaseModel {
  @hasMany(() => Profile)
  public profiles: HasMany<typeof Profile>

  @column()
  public id: string = uuid()

  @column()
  public postId: string = uuid()

  @column()
  public userId: string = uuid()

  @column()
  public commentText: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
