function Save(canvas, filename, extension) {
    var mimeType;
    if (!extension) {
      extension = 'png';
      mimeType = 'image/png';
    } else {
      switch (extension.toLowerCase()) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      default:
        mimeType = 'image/png';
        break;
      }
    }
    var downloadMime = 'image/octet-stream';
    var imageData = canvas.toDataURL(mimeType);
    imageData = imageData.replace(mimeType, downloadMime);
    downloadFile(imageData, filename, extension);
  };

function downloadFile(href, fName, extension) {
      var fx = _checkFileExtension(fName, extension);
      var filename = fx[0];
      var ext = fx[1];
      var a = document.createElement('a');
      a.href = href;
      a.download = filename;
      a.onclick = destroyClickedElement;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      href = null;
      return false;
};

function _checkFileExtension(filename, extension) {
    if (!extension) {
      extension = '';
    }
    if (!filename) {
      filename = 'untitled';
    }
    var ext = '';
    if (filename && filename.indexOf('.') > -1) {
      ext = filename.split('.').pop();
    }
    if (extension) {
      if (ext !== extension) {
        ext = extension;
        filename = filename + '.' + ext;
      }
    }
    return [
      filename,
      ext
    ];
};

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
 };
