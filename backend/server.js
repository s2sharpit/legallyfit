const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors');

const {login, register}  = require('./resolvers/users.js');
const {checkAuth} = require('./util/auth-validator.js');
const {getCaseDetails} = require ('./components/caseDetails/getCaseDetails.js');
const {getLandingPrompt} = require('./components/GPT/getPrompt.js');
const {affidavit} = require('./components/forms/affidavit.js');
const {nda} = require('./components/forms/nda.js');
const {will} = require('./components/forms/will.js');



const JWT_SECRET = process.env.SECRET_KEY;

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log(`Successfully connected to the database`)
        return app.listen(process.env.PORT);
    })
    .then((res) => {
        console.log(`Server running on port ${process.env.PORT}`);
    });

app.post('/api/change-password', async (req, res) => {
	const user = await checkAuth(req, res);

	const { token, newpassword: plainTextPassword } = req.body
	if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.get("/api/pro", async (req, res) => {
	const user = await checkAuth(req, res);
    if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	
	res.json({status: 'ok', data: user});
});


app.post('/api/login', async (req, res) => {
	login(req, res);
});

app.post('/api/register', async (req, res) => {
	register(req, res);
});

app.get('/api/user', async (req, res) => {

	const user = await checkAuth(req, res);
	if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	
	const {id} = user.id;
	
	const users = await User.findOne({_id: {$ne: id}});
	if(users) {
		res.json({status: 'ok', data: users});
	}
});

app.post('/api/generate-prompt', async (req, res) => {	
	const user = await checkAuth(req, res);
	if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	
	const {prompt} = req.body;

	try {
		const initial_prompt = await getLandingPrompt(prompt, req, res);
	
		// const output = await getCaseDetails(prompt);
		// console.log(output);

		res.json(JSON.parse(initial_prompt));	
	} catch (e) {
		console.log(e);
		res.status(406).json({status: 'error', error: 'Something went wrong'});
	}
});

app.post('/api/case-details', async (req, res) => {
	const user = await checkAuth(req, res);
	if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	
	const {prompt} = req.body;
	
	try {
		const output = await getCaseDetails(prompt);
		res.json({status: 'ok', data: output});
	} catch (e) {
		console.log(e);
		res.json({status: 'error', error: 'Something went wrong'});
	}
});


app.post('api/submit-will', async (req, res) => {
    // Access form data from req.body
	const user = await checkAuth(req, res);
    if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	const will = await affidavit(req,res);
     
     
});
app.post('api/submit-affidavit', async (req, res) => {
    const user = await checkAuth(req, res);
    if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	const affedevit = await affidavit(req,res);
     
});

app.post('api/submit-nda', async (req, res) => {
	const user = await checkAuth(req, res);
    if(!user) return res.status(401).json({status: 'error', error: 'Unauthenticated'});
	const nda = await affidavit(req,res); 
});

app.get("/api/load", async(req, res) => {
	const str = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>My HTML Document</title>
	</head>
	<body>
		<header>
			<h1>Welcome to My HTML Document</h1>
		</header>
	
		<nav>
			<ul>
				<li><a href="#">Home</a></li>
				<li><a href="#">About</a></li>
				<li><a href="#">Contact</a></li>
			</ul>
		</nav>
	
		<main>
			<section>
				<h2>About Us</h2>
				<p>This is a simple HTML document.</p>
			</section>
	
			<section>
				<h2>Contact Information</h2>
				<address>
					Email: <a href="mailto:info@example.com">info@example.com</a><br>
					Phone: +123-456-7890
				</address>
			</section>
		</main>
	
		<footer>
			<p>&copy; 2023 My HTML Document</p>
		</footer>
	</body>
	</html>
	`;
	

	res.send(str);
});
