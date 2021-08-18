
/**
 * Filters items returned from the traefik api based on the passed in filter
 * @param {Object} items - Items returned from traefik api
 * @param {string} filter - Text content that items should contain to be included
 *
 * @returns {Array} - All items that match the passed in filter
 */
const filterProxyRoutes = (list, filter) => {

  return list.reduce((filtered, item) => {
    // Only include the internal routes if a filter is passed
    // This allows access to all routes via a filter, but does not display them by default
    const includeInternal = Boolean(filter || (!filter && !item.rule.startsWith('PathPrefix')))

    item &&
      includeInternal &&
      (!filter || item.rule.includes(filter)) &&
      filtered.push(item)

    return filtered
  }, [])
}

module.exports = {
  filterProxyRoutes
}