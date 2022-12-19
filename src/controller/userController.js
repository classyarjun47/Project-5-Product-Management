
const jwt = require('jsonwebtoken')
//-------------------------*** Model import ***-----------------//

const userModel = require('../model/userModel');

//------------------------*** Improtant Regex ***----------------//
const nameValidation = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/);
const validateEmail = (/^([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/);
const validatePassword = (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/)
const validatePhone = (/^(\+\d{1,3}[- ]?)?\d{10}$/)
const pinCodeRegex = (/^\d{4}$|^\d{6}$/)


const {isValidEntry} = require('../validator/validator')


//--------------------------------------------------*** Create User ***-------------------------------------------------------------------//
const createUser = async function (req, res) {
    try {
        let data = req.body
        let { name, email, phone, password, address } = data

        if (!isValidEntry(name) || !nameValidation.test(name)) return res.status(400).send({ status: false, message: "please enter a valid name" })
        if (!isValidEntry(phone) || !validatePhone.test(phone)) return res.status(400).send({ status: false, message: "Please enter valid Phone Number" })
        if (!isValidEntry(email) || !validateEmail.test(email)) return res.status(400).send({ status: false, message: "Email is invalid, Please check your Email address" });
        if (!isValidEntry(password) || !validatePassword.test(password)) return res.status(400).send({ status: false, message: "use a strong password at least =>  one special, one Uppercase, one lowercase (character) one numericValue and password must be eight characters or longer)" });

        if(address){
            let {pincode , city , street} = address

            if(pincode && !pinCodeRegex.test(pincode))
              return res.status(400).send({ status: false, message: "Given Pincode is invalid , ex-->123456 , in 4 to 6 digit" });

            if( !nameValidation.test(city)) 
            return res.status(400).send({ status: false, message: "City name should be string only." });

            if( !nameValidation.test(street)) 
            return res.status(400).send({ status: false, message:"Street name should be string only." });
        }

        let uniqueData = await userModel.findOne({ $or : [{phone: phone} , {email: email }] })

        if (uniqueData) return res.status(400).send({ status: false, message: "Mobile Number or Email is already exist" })
     

        let saveData = await userModel.create(data)
        res.status(201).send({ status: true, message: 'Successfully register', data : saveData })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message });
    }
}



//--------------------------------------------------*** LogIn User ***-------------------------------------------------------------------//

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





module.exports = {createUser , loginUser}

