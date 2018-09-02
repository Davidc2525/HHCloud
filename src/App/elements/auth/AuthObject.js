export class AuthObject {
	constructor({ sesid, userid, auth, exist, msg, username, password }) {
		this.login = false;
		this.userid = userid;
		this.sesid = sesid;
		this.auth = auth;
		this.exist = exist;
		this.msg = msg;
		this.username = username;
		this.password = password;
		if (this.auth || this.exist) {
			this.login = true;
		}
	}
}