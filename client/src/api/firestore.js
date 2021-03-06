import { firestore as db, auth } from '../firebase.js';
import User from '../models/User';
import House from '../models/House';

// ------------------------ NOTES ------------------------
// expected fields:
// * user(uid, displayName, email, firstName, lastName, zpid, admin, lastUpdated)
// * house(hid, zpid, latitude, longitude, zip, state, city, street, comps, formData, lastUpdated)

export const DB = {
  // ------------------------ CREATE ------------------------
  async createUser(user, additionalData) {
    const userRef = db().doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      let data;
      if (!additionalData) {// if google signin
        data = new User(
          user.uid,
          user.displayName,
          user.email,
          '',
          '',
          '',
          false,
          db.FieldValue.serverTimestamp()
        );
      } else {
        const { email, firstName, lastName } = additionalData;

        data = new User(
          user.uid,
          `${firstName} ${lastName}`,
          email,
          firstName,
          lastName,
          '',
          false,
          db.FieldValue.serverTimestamp()
        );
      }

      let message;

      try {
        userRef.set(data.getUserData(), { merge: true });
        message = 'Created user successfully.';
      } catch (error) {
        message = error;
        console.error('Error creating user document: ', error);
      }

      return { message };
    }
    return { message: 'User already exists!' };
  },

  async createHouse(userID, houseData) {
    let message = { message: 'house already exists' };
    const houseRef = db().doc(`houses/${houseData.hid}`);
    const snapshot = await houseRef.get();

    if (!snapshot.exists) {
      const {
        hid,
        zpid,
        latitude,
        longitude,
        zip,
        state,
        city,
        street,
        comps,
        formData,
        lastUpdated,
        building_size,
        houseImage,
      } = houseData;
      const data = new House(
        hid,
        zpid,
        userID,
        new db.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
        zip,
        state,
        city,
        street,
        comps,
        formData,
        db.FieldValue.serverTimestamp()
      );
      const mergeData = {};

      for (const property in data.getHouseData()) {
        if (data[property] !== undefined) {
          mergeData[property] = data[property];
        }
      }
      try {
        houseRef.set(mergeData, { merge: true });
        message = { message: 'Created house successfully.' };
      } catch (error) {
        message = { message: error };
        console.error('Error creating house document', error);
      }

      const addHouseToUser = async() => await this.updateUser(userID, {zpid});
      await addHouseToUser();
    }

    return message;
  },

  // ------------------------ READ ------------------------
  async getUser(id) {
    let returnedUser;
    const user = db().collection('users').doc(id);
    try {
      returnedUser = await user.get();
    } catch (err) {
      returnedUser = { message: `Error loading user: ${err}.` };
    }

    const userObj = await returnedUser;
    const {
      displayName,
      email,
      firstName,
      lastName,
      zpid,
      admin,
      lastUpdated,
    } = userObj.data();

    const data = new User(
      userObj.id,
      displayName,
      email,
      firstName,
      lastName,
      zpid,
      admin,
      lastUpdated
    );

    return data.getUserData();
  },

  async getUsers() {
    let returnedUsers;
    const usersList = db().collection('users');
    try {
      returnedUsers = await usersList.get();
    } catch (err) {
      console.log(err);
    }
    const users = await returnedUsers;
    const usersArr = [];
    users.forEach((user) => {
      const {
        uid,
        displayName,
        email,
        firstName,
        lastName,
        zpid,
        admin,
        lastUpdated,
      } = user.data();
      const data = new User(
        uid,
        displayName,
        email,
        firstName,
        lastName,
        zpid,
        admin,
        lastUpdated
      );
      usersArr.push(data.getUserData());
    });
    return usersArr;
  },

  async getHouseByID(docID) {
    let returnedHouse;
    const house = db().collection('houses').doc(docID);

    try {
      returnedHouse = await house.get();
    } catch (err) {
      console.log(err);
    }

    const houseObj = await returnedHouse;

    const {
      hid,
      zpid,
      location,
      user,
      zip,
      state,
      city,
      street,
      comps,
      formData,
      lastUpdated,
      building_size,
      houseImage,
    } = houseObj.data();
    const data = new House(
      hid,
      zpid,
      user,
      location,
      zip,
      state,
      city,
      street,
      comps,
      formData,
      lastUpdated,
      building_size,
      houseImage
    );

    return data.getHouseData();
  },

  async getHouseByOwner(userId) {
    let returnedHouse;

    const house = db().collection('houses').where('user', '==', userId);

    try {
      returnedHouse = await house.get();
    } catch (err) {
      returnedHouse = { message: `Error loading house: ${err}.` };
    }

    let houseArr = [];
    const houseObj = await returnedHouse;

    houseObj.forEach((house) => {
      if (house.message) {
        houseArr.push(house);
      }
      const {
        hid,
        zpid,
        location,
        user,
        zip,
        state,
        city,
        street,
        comps,
        formData,
        lastUpdated,
        building_size,
        houseImage,
      } = house.data();
      const data = new House(
        hid,
        zpid,
        user,
        location,
        zip,
        state,
        city,
        street,
        comps,
        formData,
        lastUpdated,
        building_size,
        houseImage
      );

      houseArr.push(data.getHouseData());
    });
    return houseArr;
  },

  async getHouses() {
    let returnedHouses;
    const housesList = db().collection('houses');
    try {
      returnedHouses = await housesList.get();
    } catch (err) {
      returnedHouses = { message: `Error loading houses: ${err}.` };
    }

    const housesArr = [];
    const houses = await returnedHouses;

    if(!houses.message){
      houses.forEach(async (house) => {
        const {
          hid,
          zpid,
          location,
          user,
          zip,
          state,
          city,
          street,
          comps,
          formData,
          lastUpdated,
        } = house.data();
        const data = new House(
          hid,
          zpid,
          user,
          location,
          zip,
          state,
          city,
          street,
          comps,
          formData,
          lastUpdated
        );
  
        housesArr.push(data.getHouseData());
      });
    }
   
    return housesArr;
  },

  // ------------------------ UPDATE ------------------------
  async updateUser(user, updateUserData) {
    const userRef = db().doc(`users/${user}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return;
    } else {
      const {
        email,
        displayName,
        firstName,
        lastName,
        zpid,
        admin,
        lastUpdated,
      } = updateUserData;

      const data = new User(
        user,
        displayName,
        email,
        firstName,
        lastName,
        zpid,
        admin,
        db.FieldValue.serverTimestamp()
      );
      const mergeObj = {};
      const Obj = data.getUserData();

      for (const property in Obj) {
        if (Obj[property] !== undefined) {
          mergeObj[property] = Obj[property];
        }
      }

      try {
        await userRef.set(mergeObj, { merge: true });
      } catch (error) {
        return { message: `Error updating User ${user}: ${error}` };
      }
      return { message: `User updated successfully.` };
    }
  },

  async updateHouse(updateHouseData) {
    const {
      hid,
      zpid,
      location,
      user,
      zip,
      state,
      city,
      street,
      comps,
      formData,
      building_size,
      houseImage,
    } = updateHouseData;
    const data = new House(
      hid,
      zpid,
      user,
      location,
      zip,
      state,
      city,
      street,
      comps,
      formData,
      building_size,
      houseImage,
      db.FieldValue.serverTimestamp()
    );
    const mergeObj = {};
    const Obj = data.getHouseData();

    for (const property in Obj) {
      if (Obj[property] !== undefined) {
        mergeObj[property] = Obj[property];
      }
    }

    return db()
      .collection('houses')
      .where('zpid', '==', mergeObj.zpid)
      .get()
      .then((houses) => {
        const house = houses.docs[0];
        house.ref.set(mergeObj, { merge: true });
        return house;
      })
      .then((house) => {
        return { message: `House updated successfully.` };
      })
      .catch((err) => {
        return { message: `Error updating house document: ${err}` };
      });
  },

  // ------------------------ DELETE ------------------------
  async deleteUser(userID) {
    let message = [];
    const userRef = db().doc(`users/${userID}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return { message: `User ${userID} does not exist in DB.` };
    } else {
      const usersHouses = await this.getHouseByOwner(userID);

      if (usersHouses.length > 0) {
        usersHouses.forEach(async (house) => {
          const deletedHouse = await this.deleteHouse(house.hid.toString());
          message.push(deletedHouse.message);
        });
      }

      try {
        await userRef.delete();
        message.push(`User ${userID} deleted successfully.`);
      } catch (error) {
        message.push(`Error deleting User ${userID}: ${error}`);
      }

      const authedUser = auth.currentUser;

      authedUser.delete().then(function() {
        message.push(`User ${userID} deleted successfully, from Auth User list.`);
      }).catch(function(error) {
        message.push(`Error deleting User ${userID}, from Auth List: ${error}`);
      });
      return message;
    }
  },

  async deleteHouse(houseID) {
    return db()
      .collection('houses')
      .doc(houseID)
      .get()
      .then((house) => {
        house.ref.delete();
        return house;
      })
      .then((house) => {
        return { message: `House deleted successfully.` };
      })
      .catch((err) => {
        return { message: `Error deleting house ${houseID}: ${err}.` };
      });
  },
};
