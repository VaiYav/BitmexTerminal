import request from '@/utils/request'

export function postEntity({ query, params }) {
    return request({
        url: query,
        method: 'POST',
        params: params
    })
}
export function getEntity({ query, params }) {
    return request({
        url: query,
        method: 'GET',
        params: params
    })
}
