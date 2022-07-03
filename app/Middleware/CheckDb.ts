import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckDb {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    const report = await HealthCheck.getReport(),
      checkDatabase = report.report.lucid.health.healthy

    if(!checkDatabase) return response.status(500).json({ message: 'Erreur serveur' })

    await next()
  }
}