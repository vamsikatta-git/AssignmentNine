const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(express.json());
app.use(cors())

mongoose.connect('mongodb+srv://mynewDatabaseforTodo:myNewDatabase@todo.rxe1y.mongodb.net/todo?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('MongoDB connection error:', error));

app.use('/todos', require('./routes/todos'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
