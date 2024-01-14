const express = require('express');
const mongoose = require('mongoose');
const CircularJSON = require('circular-json');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

const {ListItems} = require('./Schemas/Schema')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

// Middlewares
app.use(cors());
app.use(express.json());


app.get('/getItems',async (req, res) => {
    const items = await ListItems.find();
    const jsonString = CircularJSON.stringify(items);
    res.send(jsonString);
  });

app.post('/getData', (req, res) => {
    const { item } = req.body;
  
    const newItem = {
      ...item
    }
  
    const saveItem = new ListItems(newItem);
    // Obj with Data
  
    saveItem.save().then((res) => {
      console.log('Item saved Successfully')
    }).catch((err) => {
      console.log(err)
    })
  
    res.send(item)
  });


// Route to delete an item
app.delete('/deleteItem/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
  
    try {
      await ListItems.findByIdAndDelete(itemId);
      res.sendStatus(204); // No Content
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.put('/editItem/:id', async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Find the item by ID
      const existingItem = await ListItems.findById(itemId);
  
      if (!existingItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Update the item properties
      existingItem.item = req.body.item;
      existingItem.status = req.body.status;
  
      // Save the updated item
      await existingItem.save();
  
      // Respond with the updated item
      res.json(existingItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




// Basic route
app.get('/', (req, res) => {
    res.send('Hello from MERN Server!');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
