import e from 'express';
import express, { type Application, type Request, type Response } from 'express';
import { Pool } from 'pg';


const app:Application = express()
const port = 5000

app.use(express.json())

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_yB8wq0bdvYKu@ep-plain-mouse-a19niamr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require"
})
// console.log(pool)
const initDB = async()=>{
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users(
           id SERIAL PRIMARY KEY,
           name VARCHAR(255),
           email VARCHAR(255) UNIQUE NOT NULL,
           password VARCHAR(255) NOT NULL,
           age int,
           is_active BOOLEAN DEFAULT true,
           createdAt TIMESTAMP DEFAULT NOW(),
           updatedAt TIMESTAMP DEFAULT NOW()
            )`
        )
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}
initDB()
app.get('/', (req: Request,res : Response)=>{
    console.log(req)
    // res.send("this is root route")
    res.status(200).json({
        success : true,
        message : "this is root route",
        author :" ph"
    })
})
app.post('/api/v1/users', async(req: Request,res : Response)=>{
     try {
        const {name, email , password,age} = req.body
    const result = await pool.query(`
        INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4) RETURNING *`, 
    [name, email, password, age])
    console.log(result)
   
      res.status(200).json({
        success : true,
        message : "this is root route",
        data: result.rows[0]
    })
     } catch (error: any) {
         res.status(500).json({
        success : false,
        message : error.message,
        // data: result.rows[0]
    })
     }
}) 
app.listen(port, ()=>{
    console.log(`The express server is running on port ${port}`)
})