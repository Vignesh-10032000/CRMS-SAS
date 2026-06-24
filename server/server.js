const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');

dotenv.config();

if(!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('development-only')){
  console.warn('Configure a strong JWT_SECRET before production deployment');
}

const app=express();
app.use(helmet());
app.use(cors({
  origin:(process.env.CLIENT_URL||'http://localhost:5173').split(','),
  credentials:true
}));
app.use(express.json({limit:'1mb'}));

const authLimiter=rateLimit({windowMs:15*60*1000,max:10});
app.use('/api/auth',authLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/support', require('./routes/support'));
app.use('/api/communications', require('./routes/communications'));
app.use('/api/users', require('./routes/users'));

app.get('/health',(req,res)=>res.json({status:'ok'}));
app.use((req,res)=>res.status(404).json({message:'Route not found'}));
app.use((err,req,res,next)=>{
 console.error(err);
 res.status(500).json({message:'Internal server error'});
});

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
