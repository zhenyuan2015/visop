// https://swagger.io/docs/specification/describing-responses/


exports.generateSwagger = function(filename, initJson){
    function generateSwagger(){
        var filename = FILE_NAME;
        var sourceFile = path.join(CURRENT_PATH, 'helper','api.json')
        var targetFile = path.join(BASE_PATH,'public','swagger.json')
        var configJsonFile =  path.join(CURRENT_PATH, filename + '.json')
        var apiJson = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'))
        var configJson = JSON.parse(fs.readFileSync(configJsonFile, 'utf-8'))
        apiJson.paths = {}
        for(var i=0;i<configJson.data.length;i++){
            apiJson.paths[configJson.data[i].id] = {
              "post": {
                  "tags": [
                      "user"
                  ],
                  "summary": configJson.data[i].description,
                  "description": "",
                  // "operationId": "",
                  "produces": [
                      "application/xml",
                      "application/json"
                  ],
                  "parameters": [],
                  "responses": {
                      "200": {
                        "description": "successful operation"
                    }
                  }
              }
          }
          for(var item in configJson.data[i].parameters){
            apiJson.paths[configJson.data[i].id].post.parameters.push({
              "name": item,
              "in": "body",
              "description": configJson.data[i].parameters[item].errorMessage,
              "required": configJson.data[i].parameters[item].notEmpty?true:false,
              "type": "string"
            })
          }
    
        }
    
        fs.copySync(sourceFile, targetFile,{overwrite:true});
        
      }
}