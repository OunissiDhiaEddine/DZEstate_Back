const express =require ('express') ;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const { MONGO_URI } = require('./serverconfig');

const app = express();


// Connecting L DZEstate database fi mongodb atlas 
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB aw ymchi lets go !'))
    .catch(err => console.log(err));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test server aw ymchi at port:  ${PORT}`));