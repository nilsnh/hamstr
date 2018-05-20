import { buildMysqlParams, parseUri } from 'mysql-parse'
import { promisify } from 'util'
const exec = promisify(require('child_process').exec)
const tunnel = promisify(require('tunnel-ssh'))

interface ProgramInput {
  target: string
  options: {
    tunnel?: Boolean
    path?: string
  }
}

interface MysqldumpConfig {
  uri: string
  path: string
}

interface TunnelConfig {
  host: string
  dstPort: string
  username: string
  password: string
}

function buildMysqldumpConfig({
  target,
  options
}: ProgramInput): MysqldumpConfig {
  const uri = getOrExit(`HAMSTR_${target}_DB`)
  const { path = `${target.toLowerCase()}.sql` } = options
  return { uri, path }
}

function buildTunnelConfig({ target, options }: ProgramInput): TunnelConfig {
  const [originalstring, username, host] = <Array<string>>/(\w*)@(.*)/g.exec(
    getOrExit(`HAMSTR_${target}_SSH`)
  )
  const password = getOrExit(`HAMSTR_${target}_SSH_PW`)
  const { port: dstPort } = parseUri(getOrExit(`HAMSTR_${target}_DB`))
  return { host, dstPort, username, password }
}

async function mysqldump({ target, options }: ProgramInput) {
  target = target.toUpperCase()
  if (options.tunnel) {
    await openTunnel(buildTunnelConfig({ target, options }))
  }
  runMysqldump(buildMysqldumpConfig({ target, options }))
}

async function openTunnel(tunnelConfig: TunnelConfig) {
  await tunnel(tunnelConfig)
  const { username, host } = tunnelConfig
  console.log(`Opened tunnel to ${username}@${host}`)
}

async function runMysqldump({ uri, path }: MysqldumpConfig) {
  const params = buildMysqlParams(uri)
  console.log(`Running mysqldump, saving data in ${path}`)
  const child = await exec(`mysqldump ${params} > ${path}`, null)
  // if we kill node we should kill mysql as well
  process.on('exit', () => child.kill())
}

function getOrExit(variable: string): string {
  if (!process.env[variable]) {
    throw new Error(
      `Tried looking up ${variable} but could not find it. \n\nDid you define an entry for this in your .env file?`
    )
  }
  return process.env[variable] || ''
}

module.exports = {
  mysqldump
}
