import type {VehicleSelection} from '~/types/catalog'

export const useVehicleState = () => useCookie<VehicleSelection | null>('dan-vehicle', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
})
