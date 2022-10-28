import { sendError } from "h3"
import { getUserByUsername } from "~~/server/db/users"
import bcrypt from "bcrypt"
import { generateTokens, sendRefreshToken} from "~~/server/utils/jwt"
import { exclude } from "~~/server/utils/exclude"
import { createRefreshToken } from "~~/server/db/refreshTokens"
import { User } from "@prisma/client"

export default defineEventHandler(async (event) => {
    const body = await useBody(event)

    const { username, password} = body

    if(!username || !password) {
        return sendError(event, createError({statusCode: 400, statusMessage: 'Invalid params'}))  
    }

    const user: User = await getUserByUsername(username)

    if(!user) {
        return sendError(event, createError({statusCode: 400, statusMessage: 'Username or Password is invalid'}))  
    }

    const doesPasswordsMatch = await bcrypt.compare(password, user.password)

    if(!doesPasswordsMatch) {
        return sendError(event, createError({statusCode: 400, statusMessage: 'Username or Password is invalid'}))   
    }

    const {accessToken, refreshToken} = generateTokens(user)

    await createRefreshToken({
        token: refreshToken,
        userId: user.id
    })

    sendRefreshToken(event, refreshToken)

    return {
        accessToken: accessToken,
        user: exclude(user, 'password', 'createdAt', 'updatedAt')
    }

})