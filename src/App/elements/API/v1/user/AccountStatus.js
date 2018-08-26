import User from "./User.js"
class ContentSummary {
	constructor({
			directoryCount,
			fileCount,
			length,
			spaceQuota,
			spaceConsumed,
			quota
		}) {

	 this.directoryCount = directoryCount ;
	 this.fileCount = fileCount ;
	 this.length = length ;
	 this.spaceQuota = spaceQuota ;
	 this.spaceConsumed = spaceConsumed ;
	 this.quota = quota ;
	}

	setDirectoryCount(newValue){this.directoryCount = newValue; return this;}
	setFileCount(newValue){this.fileCount = newValue; return this;}
	setLength(newValue){this.length = newValue; return this;}
	setSpaceQuota(newValue){this.spaceQuota = newValue; return this;}
	setSpaceConsumed(newValue){this.spaceConsumed = newValue; return this;}
	setQuota(newValue){this.quota = newValue; return this;}

	getDirectoryCount(){return this.directoryCount}
	getFileCount(){return this.fileCount}
	getLength(){return this.length}
	getSpaceQuota(){return this.spaceQuota}
	getSpaceConsumed(){return this.spaceConsumed}
	getQuota(){return this.quota}
}

class AccountStatus {
	constructor(user,storageSummary){
		this.user = new User(user);
		this.contentSummary = new ContentSummary(storageSummary);
	}

	getUser(){return this.user;}
	getContentSummary(){return this.contentSummary;}

	toObject(){
		return JSON.parse(JSON.stringify(this));
	}
}


export default AccountStatus