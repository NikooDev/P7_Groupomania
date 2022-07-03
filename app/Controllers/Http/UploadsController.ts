import fs from 'fs'
import Avatar from 'App/Models/Avatar'
import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadsController {
	/**
	 * Upload avatar
	 * @param request
	 * @param auth
	 * @param response
	 */
	public async postAvatar ({ request, auth, response }: HttpContextContract) {
		const avatar = request.file('file', {
			extnames: ['jpg', 'png', 'jpeg']
		})

		try {
			await auth.use('api').authenticate()

			const uploadPath = Application.tmpPath('static/avatars/'+auth.user?.id+'/')

			if(avatar) {
				const avatarExist = await Avatar.findBy('userId', auth.user?.id)
				if(avatarExist) fs.unlinkSync(uploadPath + avatarExist.avatarUrl)

				const newAvatar = await Avatar.updateOrCreate({ userId: auth.user?.id }, { avatarUrl: avatar.clientName })
				if(newAvatar.$isPersisted) {
					await avatar.move(uploadPath)
				}
			}

			return { ok: true }
		} catch (e) {
			return response.json({ ok: false, message: 'Erreur serveur' })
		}
	}

	public async deleteAvatar ({ response, auth }: HttpContextContract) {
		try {
			const uploadPath = Application.tmpPath('static/avatars/'+auth.user?.id+'/')
			const avatarExist = await Avatar.findBy('userId', auth.user?.id)

			if(avatarExist) {
				fs.unlinkSync(uploadPath + avatarExist.avatarUrl)
				await avatarExist.delete()
			}

			return response.status(200).json({ ok: true })
		} catch (e) {
			return response.json({ ok: false, message: 'Erreur serveur' })
		}
	}
}
