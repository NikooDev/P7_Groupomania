import Profile from 'App/Models/Profile'
import Avatar from 'App/Models/Avatar'
import Post from 'App/Models/Post'
import Album from 'App/Models/Album'
import Photo from 'App/Models/Photo'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { column, beforeSave, BaseModel, hasOne, hasMany, HasOne, HasMany } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasOne(() => Avatar)
  public avatar: HasOne<typeof Avatar>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Album)
  public albums: HasMany<typeof Album>

  @hasMany(() => Photo)
  public photos: HasMany<typeof Photo>

  @column({ isPrimary: true })
  public id: string = uuid()

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column()
  public usernameChanged: boolean

  @column()
  public rememberMeToken?: string

  @column()
  public role: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
