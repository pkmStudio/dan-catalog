import {delay, groups} from '../../utils/mock-data'

export default defineEventHandler(async () => {
    await delay();
    return {data: groups}
})
