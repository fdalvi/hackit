// Definition of a Directory
function Directory (name, dateModified) {
	this.name = name;
	this.dateModified = dateModified;
	this.directories = [];
	this.files = [];
	this.parent = null;
}

Directory.prototype.addDirectory = function(child) {
	this.directories.push(child);
	child.parent = this;
};

Directory.prototype.addFile = function(child) {
	this.files.push(child);
	child.parent = this;
};

// Returns true if file was successfully deleted
Directory.prototype.removeFile = function(childName) {
	for (var i = 0; i<this.files.length; i++) {
		if(this.files[i].name == childName)
		{
			this.files[i].parent = null;
			this.files.splice(i,1);
			return true;
		}
	};
	return false;
};

Directory.prototype.removeDirectory = function(childName) {
	// First get a reference to the childObject
	var directoryIndex = -1;
	var directory;

	for (var i = 0; i<this.directories.length; i++) {
		if(this.directories[i].name == childName)
		{
			directory = this.directories[i];
			directoryIndex = i;
			break;
		}
	};

	if(directoryIndex == -1)
		return false;

	// Delete all files under the given directory
	directory.removeAllFiles();
	directory.removeAllDirectories();

	directory.parent = null;
	this.directories.splice(directoryIndex,1);
	return true;
};

Directory.prototype.removeAllFiles = function() {
	for(var i=0; i<this.files.length; i++)
		this.files[i].parent = null;
	this.files = null;
};

Directory.prototype.removeAllDirectories = function() {
	for(var i=0; i<this.directories.length; i++)
	{
		this.directories[i].removeAllFiles();
		this.directories[i].removeAllDirectories();
	}
	this.directories = null;
};

Directory.prototype.listAll = function(child) {
	var result = "";
	for(var i=0; i<this.directories.length; i++)
		result += "<span class='tabbed folder'>" + this.directories[i].name + "</span>";
	for(var i=0; i<this.files.length; i++)
		result += "<span class='tabbed'>" + this.files[i].name + "</span>";
	return result;
};

Directory.prototype.isRoot = function() {
	if(this.parent == undefined || this.parent == null)
		return true;
	else
		return false;
};

Directory.prototype.childByName = function(childName) {
	for (var i = 0; i<this.directories.length; i++) {
		if(this.directories[i].name == childName)
		{
			return this.directories[i];
			break;
		}
	};
	return null;
};

function File (name, dateModified, binaryFile, content) {
	this.name = name;
	this.dateModified = dateModified;
	this.binaryFile = binaryFile;
	this.content = content;
	this.parent = null;
}

var fileSystem = new Directory("/", null);

var newDirectory = new Directory("testDir", new Date());

newDirectory.addDirectory(new Directory("someDir", new Date()));
newDirectory.directories[0].addFile(new File("someFile1", new Date(), false, "testing...."));
newDirectory.addFile(new File("testFile1", new Date(), false, "testing...."));
newDirectory.addFile(new File("testFile2", new Date(), false, "testing...."));
newDirectory.addFile(new File("testFile3", new Date(), false, "testing...."));
newDirectory.addFile(new File("testFile4", new Date(), false, "testing...."));

fileSystem.addDirectory(newDirectory);
newDirectory = null;
fileSystem.addFile(new File("rootFile", new Date(), false, "testing...."));
