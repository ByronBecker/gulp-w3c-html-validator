// Mocha Specification Cases

// Imports
const fs =     require('fs');
const gutil =  require('gulp-util');
const should = require('should');

// Plugin
const htmlValidator = require('../html-validator.js');

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The gulp-w3c-html-validator plugin', () => {

   it('passes a valid file', (done) => {
      let fileCount = 0;
      const vinylOptions = {
         path:     'spec/html/valid.html',
         cwd:      'spec/',
         base:     'spec/html/',
         contents: fs.readFileSync('spec/html/valid.html')
         };
      const mockFile = new gutil.File(vinylOptions);
      const stream = htmlValidator({ showInfo: true });
      const notInfoType = (message) => message.type !== 'info';
      const handleFileFromStream = (file) => {
         should.exist(file);
         file.w3cjs.success.should.equal(true);
         file.w3cjs.messages.filter(notInfoType).length.should.equal(0);
         should.exist(file.path);
         should.exist(file.relative);
         should.exist(file.contents);
         file.path.should.equal('spec/html/valid.html');
         file.relative.should.equal('valid.html');
         fileCount++;
         };
      const handleEndOfStream = () => {
         fileCount.should.equal(1);
         done();
         };
      stream.on('data', handleFileFromStream);
      stream.once('end', handleEndOfStream);
      stream.write(mockFile);
      stream.end();
      });

   it('reports a file with a warning', (done) => {
      let fileCount = 0;
      const vinylOptions = {
         path:     'spec/html/warning.html',
         cwd:      'spec/',
         base:     'spec/html/',
         contents: fs.readFileSync('spec/html/warning.html')
         };
      const mockFile = new gutil.File(vinylOptions);
      const stream = htmlValidator({ showInfo: true });
      const notInfoType = (message) => message.type !== 'info';
      const handleFileFromStream = (file) => {
         should.exist(file);
         file.w3cjs.success.should.equal(true);
         file.w3cjs.messages.filter(notInfoType).length.should.equal(0);
         should.exist(file.path);
         should.exist(file.relative);
         should.exist(file.contents);
         file.path.should.equal('spec/html/warning.html');
         file.relative.should.equal('warning.html');
         fileCount++;
         };
      const handleEndOfStream = () => {
         fileCount.should.equal(1);
         done();
         };
      stream.on('data', handleFileFromStream);
      stream.once('end', handleEndOfStream);
      stream.write(mockFile);
      stream.end();
      });

   it('fails an invalid file', (done) => {
      let fileCount = 0;
      const vinylOptions = {
         path:     'spec/html/invalid.html',
         cwd:      'spec/',
         base:     'spec/html/',
         contents: fs.readFileSync('spec/html/invalid.html')
         };
      const mockFile = new gutil.File(vinylOptions);
      const stream = htmlValidator();
      const notInfoType = (message) => message.type !== 'info';
      const handleFileFromStream = (file) => {
         should.exist(file);
         file.w3cjs.success.should.equal(false);
         file.w3cjs.messages.filter(notInfoType).length.should.equal(2);
         should.exist(file.path);
         should.exist(file.relative);
         should.exist(file.contents);
         file.path.should.equal('spec/html/invalid.html');
         file.relative.should.equal('invalid.html');
         fileCount++;
         };
      const handleEndOfStream = () => {
         fileCount.should.equal(1);
         done();
         };
      stream.on('data', handleFileFromStream);
      stream.once('end', handleEndOfStream);
      stream.write(mockFile);
      stream.end();
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The verifyMessage option', () => {

   it('allows a custom error to be ignored', (done) => {
      let fileCount = 0;
      const vinylOptions = {
         path:     'spec/html/invalid.html',
         cwd:      'spec/',
         base:     'spec/html/',
         contents: fs.readFileSync('spec/html/invalid.html')
         };
      const mockFile = new gutil.File(vinylOptions);
      const verifyMessage = (type, message) => {
         const ignoreMessages = [/^End tag for  .body. seen/, /^Unclosed element .h1./];
         return !ignoreMessages.map((ignore) => ignore.test(message)).includes(true);
         };
      const stream = htmlValidator({ verifyMessage: verifyMessage });
      const handleFileFromStream = (file) => {
         should.exist(file);
         file.w3cjs.success.should.equal(true);
         fileCount++;
         };
      const handleEndOfStream = () => {
         fileCount.should.equal(1);
         done();
         };
      stream.on('data', handleFileFromStream);
      stream.once('end', handleEndOfStream);
      stream.write(mockFile);
      stream.end();
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The htmlValidator.setW3cCheckUrl() function', () => {

   it('sets a new URL to checkUrl', () => {
      htmlValidator.setW3cCheckUrl('http://localhost');
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The htmlValidator.reporter() function', () => {

   it('passes files through', () => {
      const vinylOptions = {
         path:     'spec/html/valid.html',
         cwd:      'spec/',
         base:     'spec/html/',
         contents: fs.readFileSync('spec/html/valid.html')
         };
      const mockFile = new gutil.File(vinylOptions);
      const stream = htmlValidator.reporter();
      stream.write(mockFile);
      stream.end();
      return stream;
      });

   it('contains a reporter by default', () => {
      const vinylOptions = {
         path:     'spec/html/invalid.html',
         cwd:      'spec/',
         base:     'spec/html/',
         contents: fs.readFileSync('spec/html/invalid.html')
         };
      const mockFile = new gutil.File(vinylOptions);
      mockFile.w3cjs = {
         success:  false,
         messages: ['HTML is valid']
         };
      const stream = htmlValidator.reporter();
      const writeToStream = () => stream.write(mockFile);
      (writeToStream).should.throw(/HTML validation error[(]s[)] found/);
      stream.end();
      return stream;
      });

   });
