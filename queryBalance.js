const { Pool } = require('pg')

const config = {
  user: 'paulo',
  password: 'password',
  host: 'localhost',
  database: 'bank'
}
  
const pool = new Pool(config)
 
pool.connect((err, client, release) => {
  if(err) {
    console.error('ERROR')
  } else {
    const qry = "SELECT * FROM accounts"
    client.query(qry,(err, results)=>{
      if(err) {
        console.error('ERROR')
      } else {
        console.log(results.rows)
        release()
        pool.end()
      }
    })
  }
})