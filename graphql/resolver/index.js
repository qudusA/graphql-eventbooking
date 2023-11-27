const bycrypt = require("bcryptjs");
const EventModel = require("../../models/event");
const userModel = require("../../models/user");
const BookingModel = require("../../models/booking");
const jwt = require("jsonwebtoken");

const user = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      eventCreated: event.bind(this, user.eventCreated),
    };
  } catch (err) {
    console.log();
  }
};

const event = async (eventIds) => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator),
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const singleEvent = async (eventId) => {
  const foundEvent = await EventModel.findById(eventId);

  return {
    ...foundEvent._doc,
    _id: foundEvent.id,
    event: event.bind(this, foundEvent.event),
    user: user.bind(this, foundEvent.user),
  };
};

module.exports = {
  events: async () => {
    try {
      const eventArr = await EventModel.find({});
      return eventArr.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          creator: user.bind(this, event.creator),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },

  bookings: async () => {
    const bookedArr = await BookingModel.find();
    return bookedArr.map((bookedEvent) => {
      return {
        ...bookedEvent._doc,
        _id: bookedEvent.id,
        createdAt: new Date(bookedEvent.createdAt).toISOString(),
        updatedAt: new Date(bookedEvent.updatedAt).toISOString(),
        event: singleEvent.bind(this, bookedEvent.event),
        user: user.bind(this, bookedEvent.user),
      };
    });
  },

  Login: async (args) => {
    try {
      const foundUser = await userModel.findOne({
        email: args.userInput.email,
      });
      if (!foundUser) {
        return Error("invalid user or password");
      }

      const doMatch = await bycrypt.compare(
        args.userInput.password,
        foundUser.password
      );
      if (!doMatch) {
        return Error("invalid password");
      }

      const token = await jwt.sign(
        { userId: foundUser.id, email: foundUser.email },
        "mySecretIsSecretive",
        { expiresIn: "1h" }
      );

      return {
        ...foundUser._doc,
        _id: foundUser.id,
        email: foundUser.email,
        tokenExpiration: 1,
        token,
      };
    } catch (err) {
      //   console.log(err);
      console.log("err.msg", err.message);
      return {
        message: err.message,
      };
    }
  },

  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        return Error("unAuthorized");
      }
      const loggedinUser = await userModel.findById("655b734fcede74c5f4d636e7");

      const eventObj = {
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: args.eventInput.date,
        creator: loggedinUser,
      };

      const eventInstance = new EventModel(eventObj);
      //   eventInstance.creator = loggedinUser
      const savedInstance = await eventInstance.save();
      loggedinUser.eventCreated.push(savedInstance.id);
      await loggedinUser.save();
      return {
        ...savedInstance._doc,
        creator: user.bind(this, savedInstance.creator),
      };
    } catch (err) {
      return {
        message: err.message,
      };
    }
  },

  createUser: async (args) => {
    try {
      const existingUser = await userModel.findOne({
        email: args.userInput.email,
      });
      if (existingUser) return Error("user already exist");

      const hashedPassword = await bycrypt.hash(args.userInput.password, 12);

      const userInstance = await userModel({
        email: args.userInput.email,
        password: hashedPassword,
      });

      savedUser = await userInstance.save();

      return {
        ...savedUser._doc,
        password: null,
        _id: savedUser.id,
      };
    } catch (err) {
      console.log(err);
    }
  },

  createBookings: async (args) => {
    const fetchedEvent = await EventModel.findById(args.bookingInput);
    const bookedEventInstance = new BookingModel({
      event: fetchedEvent,
      user: "655b734fcede74c5f4d636e7",
    });

    const bookedEvent = await bookedEventInstance.save();
    return {
      ...bookedEvent._doc,
      _id: bookedEvent.id,
      createdAt: new Date(bookedEvent.createdAt).toISOString(),
      updatedAt: new Date(bookedEvent.updatedAt).toISOString(),
      event: singleEvent.bind(this, bookedEvent.event),
      user: singleEvent.bind(this, bookedEvent.user),
    };
  },
};
