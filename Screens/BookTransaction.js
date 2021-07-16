import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import firebase from "firebase";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

import db from "../config";

export default class TransactionScreen extends Component {
  constructor() {
    super();

    this.state = {
      hasCamPermission: null,
      scanned: false,
      buttonState: "normal",
      scannedBookId: "",
      scannedStudentId: "",
      transactionMessage: "",
    };
  }

  getCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      hasCamPermission: status === "granted",
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ data }) => {
    const { buttonState } = this.state;
    if (buttonState === "BookId") {
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: "normal",
      });
    } else if (buttonState === "StudentId") {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: "normal",
      });
    }
  };

  handleTransaction = async () => {
    var transactionType = await this.checkBookEligibility();

    console.log("Transaction Type", transactionType);

    if (!transactionType) {
      z;
      Alert.alert("Book doesnt exists!!");

      this.setState({
        scannedStudentId: "",
        scannedBookId: "",
      });
    } else if (transactionType === true) {
      var isStudentEligible = await this.checkStudentEligibiilityForBookIssue();

      if (isStudentEligible) {
        this.initiateBookIssue();
        Alert.alert("Book is issued to the student");
      } else {
        var isStudentEligible =
          await this.checkStudentEligibiilityForBookReturn();

        if (isStudentEligible) {
          this.initiateBookReturn();

          Alert.alert("Book returned to the Library");
        }
      }
    }
  };

  checkBookEligibility = async () => {
    var bookRef = await db
      .collection("books")
      .where("bookId", "==", this.state.scannedBookId)
      .get();

    var transactionType;

    if (bookRef.docs.length === 0) {
      transactionType = false;

      console.log(books.doc.length);
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();

        console.log(book);

        if (book.bookAvail) {
          transactionType = "issue";
        } else {
          transactionType = "return";
        }
      });

      return transactionType;
    }
  };

  checkStudentEligibiilityForBookIssue = async () => {
    const studentRef = await db
      .collection("students")
      .where("studentId", "==", this.state.scannedStudentId)
      .get();

    var isStudentEligible = "";
    if (studentRef.data.length === 0) {
      isStudentEligible = false;
      Alert.alert("Student doesnt exist in student database");

      this.setState({
        scannedBookId: "",
        scannedStudentId: "",
      });
    } else {
      studentRef.docs.map((doc) => {
        var student = doc.data();

        console.log(student);

        if (student.noOfBooks < 2) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          Alert.alert("student has already issued 2 books");

          this.setState({
            scannedStudentId: "",
            scannedBookId: "",
          });
        }
      });
    }

    return isStudentEligible;
  };

  checkStudentEligibiilityForBookReturn = async () => {
    var transactionRef = await db
      .collection("transactions")
      .where("bookId", "==", this.state.scannedBookId)
      .limit(1)
      .get();

    var isStudentEligible = "";

    transactionRef.docs.map((doc) => {
      var lastBookTransaction = doc.data();
      console.log(lastBookTransaction);
    });
    if (lastBookTransaction.studentId === this.state.scannedStudentId) {
      isStudentEligible = true;
    } else {
      isStudentEligible = false;
      Alert.alert("Book wasnt issued by the student");

      this.setState({
        scannedBookId: "",
        scannedStudentId: "",
      });
    }
    return isStudentEligible;
  };

  initiateBookIssue = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "issue",
    });

    db.collection("books").doc(this.state.scannedBookId).update({
      bookAvail: false,
    });

    db.collection("students")
      .doc(this.state.scannedStudentId)
      .update({
        noOfBooks: firebase.firestore.FieldValue.increment(1),
      });

    Alert.alert("Book Issued");
    this.setState({
      scannedBookId: "",
      scannedStudentId: "",
    });
  };

  initiateBookReturn = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "return",
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      bookAvail: true,
    });

    db.collection("students")
      .doc(this.state.scannedStudentId)
      .update({
        noOfBooks: firebase.firestore.FieldValue.increment(-1),
      });

    Alert.alert("Book Returned");
    this.setState({
      scannedBookId: "",
      scannedStudentId: "",
    });
  };

  render() {
    console.log(this.state);

    if (
      this.state.hasCamPermission === true &&
      this.state.buttonState !== "normal"
    ) {
      return (
        <BarCodeScanner
          onBarCodeScanned={
            this.state.scanned ? undefined : this.handleBarCodeScanned
          }
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (this.state.buttonState === "normal") {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}
          behaviour="padding"
          enabled
        >
          <View>
            <Image
              source={require("../assets/booklogo.jpg")}
              style={{ width: 200, height: 200, alignSelf: "center" }}
            />
            <Text style={{ fontSize: 50, textAlign: "center" }}>Wily App</Text>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <TextInput
              style={{
                width: 200,
                height: 40,
                borderWidth: 1.5,
                borderRightWidth: 0,
                fontSize: 20,
              }}
              placeholder="BookId"
              onChangeText={(text) => {
                this.setState({
                  scannedBookId: text,
                });
              }}
              value={this.state.scannedBookId}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#66BB6A",
                width: 50,
                borderWidth: 1.5,
                borderLeftWidth: 0,
              }}
              onPress={() => {
                this.getCameraPermission("BookId");
              }}
            >
              <Text
                style={{ fontSize: 15, textAlign: "center", marginTop: 10 }}
              >
                Scan
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", margin: 10 }}>
            <TextInput
              style={{
                width: 200,
                height: 40,
                borderWidth: 1.5,
                borderRightWidth: 0,
                fontSize: 20,
              }}
              placeholder="StudentId"
              onChangeText={(text) => {
                this.setState({
                  scannedStudentId: text,
                });
              }}
              value={this.state.scannedStudentId}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#66BB6A",
                width: 50,
                borderWidth: 1.5,
                borderLeftWidth: 0,
              }}
              onPress={() => {
                this.getCameraPermission("StudentId");
              }}
            >
              <Text
                style={{ fontSize: 15, textAlign: "center", marginTop: 10 }}
              >
                Scan
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "yellow",
                width: 200,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                borderWidth: 2,
                borderColor: "black",
                borderRadius: 10,
              }}
              onPress={async () => {
                await this.handleTransaction();
              }}
            >
              <Text> Submit </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }
}
