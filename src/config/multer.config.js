const multer = require('multer');
 
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '/home/ubuntu/sanchit/mtix/backup/files')
		// cb(null, '/home/juhi/Documents/File')
	},
	filename: (req, file, cb) => {
	  cb(null, file.originalname)
	}
});
 
var upload = multer({storage: storage});
 
module.exports = upload;