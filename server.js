require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors")
const express = require("express");
const bcrypt = require('bcrypt');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3500;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//database connection
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Successful database connection!"))
    .catch((error) => console.log(error.message));


//LOGIN//

app.get("/login", cors(), (req, res) => {

})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404).json("notfound");
            console.log("Notfound")
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(401).json("incorrect");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occured" });
        console.log("error")

    }
});

//CREATING A NEW USER//

app.post("/usercreation", async (req, res) => {
    const { username, fullname, password, role, email, mobile, birthday, placeofbirth, sclass, subjects } = req.body;

    try {
        const check = await User.findOne({ username });
        if (check) {
            res.json("exists");
        } else {

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User({
                username,
                fullname,
                password: hashedPassword,
                role,
                email,
                mobile,
                birthday,
                placeofbirth,
                sclass,
                subjects
            });
            await newUser.save();
            res.json("notexists");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("error"); // Send an error response
    }
});

// Teachers
app.get('/teachers', async (req, res) => {
    try {
      const teachers = await User.find({ role: 'Teacher' });
  
      res.json(teachers);
    } catch (error) {
      console.error('an error occured while loading teachers', error);
      res.status(500).json({ error: 'an error occured while loading teachers' });
    }
  });

  //Students
  app.get('/students', async (req, res) => {
    try {
      const students = await User.find({ role: 'Student' });
  
      res.json(students);
    } catch (error) {
      console.error('an error occured while loading students', error);
      res.status(500).json({ error: 'an error occured while loading students' });
    }
  });

  app.get('/students/:studentName', async (req, res) => {
    try {
      const { studentName } = req.params;
      const student = await User.findOne({ fullname: studentName, role: 'Student' });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.status(200).json(student); 
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Server error occurred' });
    }
  });
  
  // Get the details of a specific teacher based on the name received in the URL
  app.get('/teachers/:teacherName', async (req, res) => {
    try {
        
      const { teacherName } = req.params;
      const teacher = await User.findOne({ fullname: teacherName, role: 'Teacher' });
  
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
  
      res.status(200).json(teacher); // Send the teacher's data back in JSON format
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Server error occurred' });
    }
  });

  // Updating a user
  app.put("/updateUser/:username", async (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;
  
    try {

      if (updatedUser.password) {
        const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
        updatedUser.password = hashedPassword;
      }

      const savedUser = await User.findOneAndUpdate(
        { username },
        updatedUser,
        { new: true }
      );
  
      if (!savedUser) {
        return res.status(404).json({ error: "User does not exist" });
      }
  
      res.status(200).json(savedUser);
    } catch (error) {
      console.error("Error while updating the user:", error);
      res.status(500).json({ error: "An error occured" });
    }
  });

  app.delete('/deleteUser/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const deletedUser = await User.findOneAndDelete({ username });
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Server error occurred' });
    }
  });
  

//SERVER LISTENING//
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
