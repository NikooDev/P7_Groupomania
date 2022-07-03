import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    reg_email: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'email' }),
      rules.email({ ignoreMaxLength: true }),
      rules.required()
    ]),
    reg_password: schema.string({ trim: true }, [
      rules.required(),
      rules.confirmed('password_confirmation')
    ])
  })

  public messages: CustomMessages = {
    required: 'Le champs {{ field }} est requis',
    'reg_email.unique': 'Un compte existe déjà avec cette adresse e-mail',
    'reg_email.email': 'Votre adresse e-mail est incorrecte',
    'reg_password.minLength': 'Le mot de passe doit contenir entre 8 et 180 caractères',
    'reg_password.maxLength': 'Le mot de passe doit contenir entre 8 et 180 caractères',
    'password_confirmation.confirmed': 'Les deux mots de passe ne correspondent pas'
  }
}
