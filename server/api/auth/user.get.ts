import { exclude } from '../../utils/exclude';
export default defineEventHandler(async (event) => {
    return {
        user: exclude(event.context.auth?.user, 'password', 'createdAt', 'updatedAt')
    }
})