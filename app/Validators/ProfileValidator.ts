import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public customError = 'Votre nom et prénom doivent contenir entre 3 et 30 caractères alphabétique'

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(30)
    ]),
    firstname: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(30)
    ])
  })

  public messages: CustomMessages = {
    required: 'Le champs {{ field }} est requis',
    minLength: this.customError,
    maxLength: this.customError
  }
}
