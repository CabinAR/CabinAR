class CabinAPI {

 static objectToFormData(obj, rootName, ignoreList) {
    var formData = new FormData();

    function appendFormData(data, root) {
        if (!ignore(root)) {
            root = root || '';
            if (data instanceof File) {
                formData.append(root, data);
            } else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    appendFormData(data[i], root + '[' + i + ']');
                }
            } else if (typeof data === 'object' && data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (root === '') {
                            appendFormData(data[key], key);
                        } else {
                            appendFormData(data[key], root + '[' + key + ']');
                        }
                    }
                }
            } else {
                if (data !== null && typeof data !== 'undefined') {
                    formData.append(root, data);
                }
            }
        }
    }

    function ignore(root){
        return Array.isArray(ignoreList)
            && ignoreList.some(function(x) { return x === root; });
    }

    appendFormData(obj, rootName);
    return formData;
 }

 static space(spaceId) {
   return CabinAPI.getData(`/api/spaces/${spaceId}`)
 }

  static pieces(spaceId) {
   return CabinAPI.getData(`/api/spaces/${spaceId}/pieces`)
  }

  static piece(pieceId) {
   return CabinAPI.getData(`/api/pieces/${pieceId}`)
  }

  static createPiece(spaceId) {
    return CabinAPI.sendData(
      `/api/spaces/${spaceId}/pieces`, 
      { },
      "POST"
      )
  }

  static savePiece(piece) {
    return CabinAPI.sendData(
       `/api/pieces/${piece.id}`,
       { piece: piece },
       "PUT"
      )
  }

  static deletePiece(pieceId) {
    return CabinAPI.sendData(
       `/api/pieces/${pieceId}`,
       { },
       "DELETE"
      )
  }

  static getData(url) {
    return window.fetch(url)
     .then(function(response) { 
      return response.json()
    })
  }

  static sendData(url,params,method) {
    console.log()
    return window.fetch(
      url, {
        method: method,
        /*headers: {
           "Content-Type": "application/json",
        },*/
        body: CabinAPI.objectToFormData(params)
      })
    .then( (response) => {
      return response.json();
    })     
  }
}

export default CabinAPI;