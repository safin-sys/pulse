import { Hono } from 'hono'
import auth from './features/auth'

const app = new Hono()

app.route('/auth', auth)

export default app
