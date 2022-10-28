import { prisma } from '.'
import bcrypt from "bcrypt"

export const createUser = (userData: any) => {
    const finalUserData = {
        ...userData,
        password: bcrypt.hashSync(userData.password, 10)
    }
    return prisma.user.create({
        data: finalUserData
    })
}

export const getUserByUsername = (username: string) => {
    return prisma.user.findUnique({
        where: {
            username
        }
    })
}

export const getUserById = (userId: string) => {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    })
}