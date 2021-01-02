const { Pool } = require('pg')
const Cursor = require('pg-cursor')

const config = {
  user: 'paulo',
  password: 'password',
  host: 'localhost',
  database: 'bank'
}

const pool = new Pool(config)
const [transaction_type, account, date, description, amount] = process.argv.slice(2)

pool.connect(async(err, client, release) => {
  if(err){
    return console.error('Error de conexión:', err.stack)
  }
  if(transaction_type === 'nueva_transaccion') {
    await newTransaction(client)
  }
  if(transaction_type === 'transacciones') {
    await transactions(client)
  }
  release()
  pool.end()
})
const newTransaction = async(client) => {
  const from = {
    text: 'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    values: [amount, account]
  }
  const to = {
    text: 'INSERT INTO trxs (description, date, amount, accountID) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [description, date, amount, account]
  }
  try {
    await client.query('BEGIN')
    await client.query(from)
    const result = await client.query(to)
    await client.query('COMMIT')
    console.log('La transacción se realizó con éxito')
    console.log('La última transacción: ', result.rows[0])
  } catch(error) {
    await client.query('ROLLBACK')  
    console.error(error)
  }
}
const transactions = async(client) => {
  const cursor = await client.query(new Cursor(`SELECT * FROM trxs WHERE accountId = ${account}`))
  cursor.read(10, (err, rows) => {
    if(err){
      return console.error(err)
    } else {
      console.log(`Nombre de la cuenta: ${account}`, rows)
    }
  })
}