import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";


const send_reservation = async (req, res, next) => {

  const { firstName, lastName, email, date, time, phone } = req.body;

  if (!firstName || !lastName || !email || !date || !time || !phone) {
    console.log("Missing fields:", { firstName, lastName, email, date, time, phone });
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    const reservation = await Reservation.create({ firstName, lastName, email, date, time, phone });
    console.log("Reservation Created:", reservation); // Debugging

    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    console.error("Error creating reservation:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    return next(error);
  }
};

export default send_reservation;

