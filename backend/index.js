import express from "express";
import { hash, compare } from "bcrypt";
import connectToMongo from "./connection/connection.js";
import User from "./schemas/schemas.js";
import cors from "cors";
const app = express();
import { config } from "dotenv";
import SendEmail from "./email/email.js";
// Call the connectToMongo function to establish the connection
(async () => {
  try {
    await connectToMongo();
    console.log("Connected to MongoDB");
    // You can start your application logic here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Load environment variables from .env file
config();

const SECRET_KEY = process.env.SECRET_KEY;

// Import the required libraries
import jwt from "jsonwebtoken";

const port = 8000 || process.env.PORT;

app.use(express.json());
app.use(cors());
// Signup API
// Signup API
app.post("/signup", async (req, res) => {
  const { fullName, contractAddress, buyersPan, sellersPan, companyName, email, role, department, password } = req.body;
  console.log(req.body);

  const user = await User.findOne({ email })
  if (user) {
    res.status(203).send({ message: "Username already exitss" });
    return
  }

  // Generate and send OTP via email
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
  console.log(process.env.USER_EMAIL, process.env.USER_PASSWORD);

  try {
    // await transporter.sendMail(mailOptions);
    const emailSent = await SendEmail(email, otp);


    // Store user data in the database (including the OTP)
    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      fullName,
      contractAddress,
      buyersPan,
      sellersPan,
      companyName,
      email,
      role,
      department,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Please check your email for OTP verification.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Signup failed. Please try again." });
  }
});

// Verify OTP API
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP matches the one stored in the database
    const user = await User.findOne({ email });

    if (user.isVerified) {
      res.status(400).json({ message: "OTP already verfified" });
    }

    if (user && user.otp === otp) {
      // Mark the user to be verified. 
      user.isVerified = true;

      await user.save();
      res.json({ success: true, message: "Email verified successfully." });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("Error in /verify-otp:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Resend OTP API
app.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a new OTP
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

    // Send the new OTP via email
    const emailSent = await SendEmail(email, otp);


    // Update the OTP in the database
    const user = await User.findOne({ email });
    if (user) {
      user.otp = otp;
      await user.save();
      res.json({
        success: true,
        message: "New OTP sent. Please check your email for verification.",
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "User not found. Resending OTP failed." });
    }
  } catch (error) {
    console.error("Error in /resend-otp:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    var { email, password } = req.body;

    // Check if the user exists and is verified
    const user = await User.findOne({ email });

    var { fullName, contractAddress, email, companyName, role, department } = user;


    if (user && user.isVerified) {
      const passwordMatch = compare(password, user.password);
      // If password matches then only generate the access token
      if (passwordMatch) {
        // Generate an access token
        const accessToken = jwt.sign(
          {
            email: user.email,
            contractAddress: user.contractAddress,
            buyersPan: user.buyersPan,
            sellersPan: user.sellersPan,
            fullName: user.fullName,
            companyName: user.companyName,
            role: user.role,
            department: user.department,
          },
          SECRET_KEY,
          {
            expiresIn: "1w", // Token expires in 1 hour, adjust this as needed
          }
        );

        res.json({
          success: true,
          message: `Welcome, ${user.fullName}!`,
          accessToken: accessToken, // Include the access token in the response
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Incorrect email or password." });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or unverified account.",
      });
    }
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/user-details", (req, res) => {
  const accessToken = req.headers.authorization; // Assuming you send the access token in the "Authorization" header


  // If there is no bearer token or if it is not bearer token then return error message.
  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing or not in the correct format.",
    });
  }
  const token = accessToken.split("Bearer ")[1];


  // Verify the access token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    // If the token is valid, you can access user details from the decoded payload
    const { email, contractAddress, buyersPan, sellersPan, fullName, companyName, role, department } = decoded;
    console.log(decoded)


    // You can now return the user details in the response
    res.json({
      success: true,
      userDetails: {
        email,
        contractAddress,
        buyersPan,
        sellersPan,
        fullName,
        companyName,
        role,
        department,
      },
    });
  });
});


app.post("/contact", async (req, res) => {
  console.log(req.body)
  const { email, name, concern, product_id } = req.body;
  try {
    // await transporter.sendMail(mailOptions);
    const emailSent = await SendEmail(process.env.USER_EMAIL, concern, product_id, `you have message from ${email} ${name}. Here is the concern: \n \n`);
    res.status(200).send({ "message": "Your email has been sent successfully" })
  }
  catch (err) {
    res.status(500).send("message error: " + err.message)
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
