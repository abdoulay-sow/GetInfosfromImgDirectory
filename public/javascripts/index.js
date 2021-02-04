$("#files").change(function() {
  filename = this.files[0].name

  if(this.files.length > 0) {
    $('#envoyer').attr('disabled', false)
    if(this.files.length === 1) {
      $('#message').text((this.files.length + 1) +" fichier est ajouté")
    } else {
      $('#message').text((this.files.length + 1) +" fichiers sont ajoutés")
    }    
  }
});

$('form').submit(function(e) {
  e.preventDefault()    

  var formData = new FormData(this);
  var files = formData.getAll('folder[]');

  for(var i = 0; i < files.length; i += 1) {  
    let toearase = files[i].webkitRelativePath.split('/')[0]
    let name = files[i].webkitRelativePath
    .replace(toearase + '/', '')
    .replaceAll('/', '____');
    files[i].name = name;
    formData.append("files[]", files[i], name)
    console.log('NAme => ', name)
  }

  formData.delete('folder[]');

  $.ajax({
    url:'/',
    method:'POST',
    data:formData,
    contentType:false,
    cache:false,
    processData:false,
    beforeSend:function(){
      console.log('Sending');
    },
    success:function(data, status, xhr){
      let uri = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
      let url = uri + data.content;
      setTimeout(function () {
          var location = document.createElement("a");
          location.href = url;
          location.download = "faces.xlsx"
          document.body.appendChild(location)
          location.click()
      }, 100);
    },
    errors:function(err) {
      console.log(err);
    }
  });
})

$(function() {
  if(!this.files) {    
    $('#envoyer').attr('disabled', true)
  } else if(this.files.length == 0) {    
    $('#envoyer').attr('disabled', true)
  }
  else {
    $('#envoyer').attr('disabled', false)
  }
})