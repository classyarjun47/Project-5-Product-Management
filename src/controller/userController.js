
// const jwt = require('jsonwebtoken')
// //-------------------------*** Model import ***-----------------//

// const userModel = require('../model/userModel');

// //------------------------*** Improtant Regex ***----------------//
// const nameValidation = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/);
// const validateEmail = (/^([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/);
// const validatePassword = (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/)
// const validatePhone = (/^(\+\d{1,3}[- ]?)?\d{10}$/)
// const pinCodeRegex = (/^\d{4}$|^\d{6}$/)


// const {isValidEntry} = require('../validator/validator')


// //--------------------------------------------------*** Create User ***-------------------------------------------------------------------//
// const createUser = async function (req, res) {
//     try {
//         let data = req.body
//         let { name, email, phone, password, address } = data

//         if (!isValidEntry(name) || !nameValidation.test(name)) return res.status(400).send({ status: false, message: "please enter a valid name" })
//         if (!isValidEntry(phone) || !validatePhone.test(phone)) return res.status(400).send({ status: false, message: "Please enter valid Phone Number" })
//         if (!isValidEntry(email) || !validateEmail.test(email)) return res.status(400).send({ status: false, message: "Email is invalid, Please check your Email address" });
//         if (!isValidEntry(password) || !validatePassword.test(password)) return res.status(400).send({ status: false, message: "use a strong password at least =>  one special, one Uppercase, one lowercase (character) one numericValue and password must be eight characters or longer)" });

//         if(address){
//             let {pincode , city , street} = address

//             if(pincode && !pinCodeRegex.test(pincode))
//               return res.status(400).send({ status: false, message: "Given Pincode is invalid , ex-->123456 , in 4 to 6 digit" });

//             if( !nameValidation.test(city)) 
//             return res.status(400).send({ status: false, message: "City name should be string only." });

//             if( !nameValidation.test(street)) 
//             return res.status(400).send({ status: false, message:"Street name should be string only." });
//         }

//         let uniqueData = await userModel.findOne({ $or : [{phone: phone} , {email: email }] })

//         if (uniqueData) return res.status(400).send({ status: false, message: "Mobile Number or Email is already exist" })
     

//         let saveData = await userModel.create(data)
//         res.status(201).send({ status: true, message: 'Successfully register', data : saveData })

//     } catch (error) {
//         console.log(error.message)
//         res.status(500).send({ status: false, message: error.message });
//     }
// }



// //--------------------------------------------------*** LogIn User ***-------------------------------------------------------------------//

// const loginUser = async function (req, res) {
//     try {
//         const { email, password } = req.body

//         if (!email || !password) {
//             return res.status(400).send({ status: false, message: "Mail id or password is required" })
//         }

//         const userData = await userModel.findOne({ email: email, password: password })

//         if (!userData) return res.status(400).send({ status: false, message: "incorrect email or password" })
        
//         const token = jwt.sign({ userId: userData._id.toString() }, "projectsecretcode" , { expiresIn: '24h' })

//         return res.status(200).send({ status: true, message: "succesfull logged in", token: token })
//     }
//     catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }





// module.exports = {createUser , loginUser}


const userModel = require("../model/userModel")
const validator = require('../validator/validator')
const aws = require('../validator/awsS3')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
  try {

    let requestBody = JSON.parse(JSON.stringify(req.body))



    if (!validator.isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: 'invalid Input Parameters' })
    }

    let { fname, lname, email, phone, password, address } = requestBody

    address = JSON.parse(address)

    let files = req.files
    let uploadedFileURL

    if (!validator.isValid(fname)) {

      return res
        .status(400)
        .send({ Status: false, Message: 'invalid First Name' })
    }

    if (!validator.isValidCharacters(fname)) {
      return res
        .status(400)
        .send({ Status: false, msg: "This attribute can only have letters as input" })
    }


    if (!validator.isValid(lname)) {
      return res
        .status(400)
        .send({ Status: false, message: 'invalid last Name' })
    }

    if (!validator.isValidCharacters(lname)) {
      return res
        .status(400)
        .send({ Status: false, msg: "This attribute can only have letters as input" })
    }

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: 'email is required' })
    }

    if (!validator.isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: 'please enter a valid email' })
    }

    let isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) {
      return res
        .status(400)
        .send({ status: false, message: `This email ${email} is Already In Use` })
    }

    if (!validator.isValid(phone)) {
      return res
        .status(400)
        .send({ Status: false, message: "Please provide phone number" })

    }

    if (!validator.isValidPhone(phone)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter A valid phone Nummber' })

    }

    let isPhoneExist = await userModel.findOne({ phone })
    if (isPhoneExist) {
      return res
        .status(400)
        .send({ status: false, message: `This Phone ${phone} No. is Already In Use` })
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: 'password Is Required' })
    }

    password = password.trim()

    if (!validator.isvalidPass(password)) {
      return res
        .status(400)
        .send({ status: false, message: `password Should Be In Beetween 8-15 ` })
    }

    let hashedPassword = await validator.hashedPassword(password)


    if (!address) {
      return res
        .status(400)
        .send({ status: false, message: 'address is required' })
    }

    if (!validator.isValid(address['shipping']['street'])) {
      return res
        .status(400)
        .send({ status: false, message: 'Shipping Street is required' })
    }

    if (!validator.isValid(address['shipping']['city'])) {
      return res
        .status(400)
        .send({ status: false, message: 'Shipping city is required' })

    }

    if (!validator.isValid(address['shipping']['pincode'])) {
      return res
        .status(400)
        .send({ status: false, message: 'Shipping Pincode is required' })
    }

    if (!validator.isValidPincode(parseInt(address['shipping']['pincode']))) {
      return res
        .status(400)
        .send({ status: false, message: 'Invalid pincode' })

    }

    if (!validator.isValid(address['billing']['street'])) {
      return res
        .status(400)
        .send({ status: false, message: 'Billing Street is required' })

    }

    if (!validator.isValid(address['billing']['city'])) {
      return res
        .status(400)
        .send({ status: false, message: 'Billing city is required' })

    }

    if (!validator.isValid(address['billing']['pincode'])) {
      return res
        .status(400)
        .send({ status: false, message: 'Billing Pincode is required' })
    }

    if (!validator.isValidPincode(parseInt(address['billing']['pincode']))) {
      return res
        .status(400)
        .send({ status:false, message: 'Invalid pincode'})

    } 
 } catch(err){
    console.log(err)
    return res.status(500).send({ status: false, message: err.message })
    }

}


module.exports.register = register;
//**************************************************************************************************************
//login
const loginUser = async function (req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({ status: false, message: "Mail id or password is required" })
        }

        const userData = await userModel.findOne({ email: email, password: password })

        if (!userData) return res.status(400).send({ status: false, message: "incorrect email or password" })
        
        const token = jwt.sign({ userId: userData._id.toString() }, "projectsecretcode" , { expiresIn: '24h' })

        return res.status(200).send({ status: true, message: "succesfull logged in", token: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.loginUser=loginUser



//*******************************************************update************************************************


const updateUser = async function (req, res) {
    try {
        const userId = req.params.userId

        const user = await userModel.findOne({ _id: userId })
        if (!user) {
            return res.status(404).send({ status: false, message: `user not found with this id ${userId}` })
        }

        let { fname, lname, email, phone, password, address } = req.body

        const dataToUpdate = {};

        if (validator.isValid(fname)) {
            dataToUpdate['fname'] = fname.trim()
        }
        if (validator.isValid(lname)) {
            dataToUpdate['lname'] = lname.trim()
        }
        if (validator.isValid(email)) {
            const checkEmail = await userModel.find({ email: email })
            if (checkEmail.length > 0) {
                return res.status(400).send({ status: false, message: `${email} is already registered` })
            }
            dataToUpdate['email'] = email.trim()
        }
        if (validator.isValid(phone)) {
            const checkphone = await userModel.find({ phone: phone })
            if (checkphone.length > 0) {
                return res.status(400).send({ status: false, message: `${phone} is already registered` })
            }
            dataToUpdate['phone'] = phone.trim()
        }
        if (validator.isValid(password)) {
            if (password.trim().length < 8 || password.trim().length > 15) {
                return res.status(400).send({ status: false, message: `${password} is an invalid password it should be in between 8 to 15 characters` })
            } 
            const saltRounds = 10;
                let hash = await bcrypt.hash(password, saltRounds);
                dataToUpdate['password'] = hash;
        }

        if (address) {
            address = JSON.parse(address)
            if (address.shipping != null) {
                if (address.shipping.street != null) {
                    if (!validator.isValid(address.shipping.street)) {
                        return res.status(400).send({ statsu: false, message: 'Please provide street address in shipping address.' })
                    }
                    dataToUpdate['address.shipping.street'] = address.shipping.street
                }
                if (address.shipping.city != null) {
                    if (!validator.isValid(address.shipping.city)) {
                        return res.status(400).send({ statsu: false, message: 'Please provide City  in shipping address.' })
                    }
                    dataToUpdate['address.shipping.city'] = address.shipping.city
                }
                if (address.shipping.pincode != null) {
                    if (!(validator.isNumber(address.shipping.pincode))) {
                        return res.status(400).send({ status: false, message: ' Please provide a valid pincode in 6 digits' })
                    }
                    dataToUpdate['address.shipping.pincode'] = address.shipping.pincode
                }
            }

            if (address.billing != null) {
                if (address.billing.street != null) {
                    if (!validator.isValid(address.billing.street)) {
                        return res.status(400).send({ statsu: false, message: 'Please provide street address in billing address.' })
                    }
                    dataToUpdate['address.billing.street'] = address.billing.street
                }
                if (address.billing.city != null) {
                    if (!validator.isValid(address.billing.street)) {
                        return res.status(400).send({ statsu: false, message: 'Please provide City in Billing address.' })
                    }
                    dataToUpdate['address.billing.city'] = address.billing.city
                }
                if (address.billing.pincode != null) {
                    if (!(validator.isNumber(address.billing.pincode))) {
                        return res.status(400).send({ status: false, message: ' Please provide a valid pincode in 6 digits' })
                    }
                    dataToUpdate['address.billing.pincode'] = address.billing.pincode
                }
            }
        }

        const files = req.files
        if (files.length != 0) {

            const uploadedFileURL = await aws.uploadFile(files[0])
            dataToUpdate['profileImage'] = uploadedFileURL;
        }

        const userdetails = await userModel.findOneAndUpdate({ _id: userId }, dataToUpdate, { new: true })
        return res.status(200).send({ status: true, message: "updated user Profile", data: userdetails })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
        
        module.exports.updateUser=updateUser