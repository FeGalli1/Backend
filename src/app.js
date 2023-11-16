import server from './server.js'
import config from './config.js'

//se conecta con el servidor mongodb LOCAl
import './DataBase.js'

server.listen(config.PORT, () => console.log(' server is running'))
