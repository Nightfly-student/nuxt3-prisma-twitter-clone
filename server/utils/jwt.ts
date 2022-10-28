import { RefreshToken, User } from "@prisma/client"
import jwt from "jsonwebtoken"

const generateAccessToken = (user: User) => {
    const config = useRuntimeConfig()

    return jwt.sign({ userId: user.id }, config.jwtAccessSecret, {
        expiresIn: '10m'
    })
}

const generateRefreshToken = (user: User) => {
    const config = useRuntimeConfig()

    return jwt.sign({ userId: user.id }, config.jwtRefreshSecret, {
        expiresIn: '4h'
    })
}

export const decodeRefreshToken = (token: string): RefreshToken | boolean => {
    const config = useRuntimeConfig()

    try {
        return jwt.verify(token, config.jwtRefreshSecret) as RefreshToken
    } catch (err) {
        return false
    }
}

export const decodeAccessToken = (token: string): any => {
    const config = useRuntimeConfig()

    try {
        return jwt.verify(token, config.jwtAccessSecret)
    } catch (err) {
        return false
    }
}

export const generateTokens = (user: User) => {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)


    return {
        accessToken,
        refreshToken
    }
}

export const sendRefreshToken = (event, token) => {
    console.log(token)
    setCookie(event, "refresh_token", token, {
        httpOnly: true,
        sameSite: true
    })
}