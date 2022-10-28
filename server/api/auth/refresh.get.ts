import { sendError } from "h3"
import { decodeRefreshToken } from "~~/server/utils/jwt"
import { getRefreshTokenByToken } from "../../db/refreshTokens"
import { getUserById } from "../../db/users"
import { generateTokens } from "../../utils/jwt"
import { RefreshToken } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const cookies = useCookies(event)

  const refreshToken = cookies.refresh_token

  if (!refreshToken) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Refresh token is invalid",
      })
    )
  }

  const rToken = await getRefreshTokenByToken(refreshToken)

  if (!rToken) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Refresh token is invalid",
      })
    )
  }

  const token = decodeRefreshToken(refreshToken)

  if(!token) {
    return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: "Something went wrong",
        })
      )
  }

  try {
    const user = await getUserById((token as RefreshToken).userId)

    const { accessToken } = generateTokens(user)

    return { access_token: accessToken }
  } catch (err) {
    return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: "Something went wrong",
        })
      )
  }
})
