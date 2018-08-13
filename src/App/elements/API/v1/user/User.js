//User.js


class User {
	constructor({id,email,emailVerified=false,username,firstName,lastName,gender="m",createAt,password}){
		this.id = id;
		this.email = email;
		this.emailVerified = emailVerified;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.createAt = createAt;
		this.password = password;
	}

	getId(){return this.id;}
	getEmail(){return this.email;}
	getIsVerified(){return this.emailVerified}
	getUserName(){return this.username}
	getFirstName(){return this.firstName}
	getLastName(){return this.lastName}
	getGender(){return this.gender}
	getPassWord(){return this.password}

	setId(newValue){this.id = newValue; return this}
	setEmail(newValue){this.email = newValue; return this}
	setIsVerified(newValue){this.emailVerified = newValue; return this}
	setUserName(newValue){this.username = newValue; return this}
	setFirstName(newValue){this.firstName =newValue; return this}
	setLastName(newValue){this.lastName = newValue; return this}
	setGender(newValue){this.gender = newValue; return this}
	setPassWord(newValue){this.password = newValue; return this}

	toObject() {
		return JSON.parse(JSON.stringify(this))
	}
}
window.User = User;
export default User;
export {User};