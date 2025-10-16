import banner from './banner'
import common from './common'
import features from './features'
import metadata from './metadata'
import pages from './pages'
import search from './search'
import theme from './theme'

export default {
  ...common,
  ...banner,
  ...search,
  ...metadata,
  ...theme,
  ...features,
  ...pages,
}
