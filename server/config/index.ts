// 根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
import development from './development'
import local from './local'
import production from './production'

interface EnvConfig {
  [key: string]: any
}

const nodeEnv: string = process.env.NODE_ENV || 'local'
const allConfig: EnvConfig = { test: local, local, development, production }

export default allConfig[nodeEnv]
