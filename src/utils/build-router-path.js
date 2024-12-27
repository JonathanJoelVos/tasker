export function buildRouterPath(path){
    const routerParameterRgex = /:([a-zA-Z]+)/g
    const pathWithParameter = path.replaceAll   (routerParameterRgex, '(?<$1>[a-z0-9\-_]+)')

    const pathReegex = new RegExp(`^${pathWithParameter}(?<query>\\?(.*))?$`)

    return pathReegex
}